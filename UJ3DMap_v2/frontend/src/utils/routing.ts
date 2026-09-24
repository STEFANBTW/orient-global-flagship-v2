import type { RoutingEdgeFeature } from '../data/mockGeoJSON';

export interface GraphNode {
  id: string;
  lng: number;
  lat: number;
}

export interface GraphEdge {
  target: string;
  distance: number;
  allowed_modes: ('pedestrian' | 'vehicle')[];
  accessible: boolean;
}

export type Graph = Map<string, { node: GraphNode; edges: GraphEdge[] }>;

// Calculates Haversine distance in meters between two coordinates
export function getDistance(lng1: number, lat1: number, lng2: number, lat2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Converts coordinates to a string key
function toKey(lng: number, lat: number): string {
  return `${lng.toFixed(6)},${lat.toFixed(6)}`;
}

// Builds the routing graph from GeoJSON features
export function buildGraph(features: RoutingEdgeFeature[]): Graph {
  const graph: Graph = new Map();

  features.forEach((feature) => {
    const coords = feature.geometry.coordinates;
    const { allowed_modes, accessible } = feature.properties;

    for (let i = 0; i < coords.length - 1; i++) {
      const [lng1, lat1] = coords[i];
      const [lng2, lat2] = coords[i + 1];

      const key1 = toKey(lng1, lat1);
      const key2 = toKey(lng2, lat2);

      const distance = getDistance(lng1, lat1, lng2, lat2);

      // Node 1 setup
      if (!graph.has(key1)) {
        graph.set(key1, { node: { id: key1, lng: lng1, lat: lat1 }, edges: [] });
      }
      // Node 2 setup
      if (!graph.has(key2)) {
        graph.set(key2, { node: { id: key2, lng: lng2, lat: lat2 }, edges: [] });
      }

      // Add bidirectional edges
      graph.get(key1)!.edges.push({
        target: key2,
        distance,
        allowed_modes,
        accessible,
      });

      graph.get(key2)!.edges.push({
        target: key1,
        distance,
        allowed_modes,
        accessible,
      });
    }
  });

  return graph;
}

// Dijkstra's algorithm implementation
export function findShortestPath(
  graph: Graph,
  startCoord: [number, number],
  endCoord: [number, number],
  mode: 'pedestrian' | 'vehicle',
  accessibleOnly: boolean = false
): { path: [number, number][]; distance: number } | null {
  // Helper to find the closest node in the graph to a given coordinate
  const findClosestNode = (coord: [number, number]): string | null => {
    let minDistance = Infinity;
    let closestKey: string | null = null;

    for (const [key, val] of graph.entries()) {
      const dist = getDistance(coord[0], coord[1], val.node.lng, val.node.lat);
      if (dist < minDistance) {
        minDistance = dist;
        closestKey = key;
      }
    }
    return closestKey;
  };

  const startKey = findClosestNode(startCoord);
  const endKey = findClosestNode(endCoord);

  if (!startKey || !endKey) return null;

  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const queue = new Set<string>();

  // Initialize
  for (const key of graph.keys()) {
    distances.set(key, Infinity);
    previous.set(key, null);
    queue.add(key);
  }
  distances.set(startKey, 0);

  while (queue.size > 0) {
    // Find node with minimum distance
    let currentKey: string | null = null;
    let minDistance = Infinity;

    for (const key of queue) {
      const dist = distances.get(key)!;
      if (dist < minDistance) {
        minDistance = dist;
        currentKey = key;
      }
    }

    if (currentKey === null || currentKey === endKey) {
      break;
    }

    queue.delete(currentKey);

    const currentNode = graph.get(currentKey)!;

    for (const edge of currentNode.edges) {
      if (!queue.has(edge.target)) continue;

      // Filter by travel mode
      if (!edge.allowed_modes.includes(mode)) continue;

      // Filter by accessibility
      if (accessibleOnly && !edge.accessible) continue;

      const alt = distances.get(currentKey)! + edge.distance;
      if (alt < distances.get(edge.target)!) {
        distances.set(edge.target, alt);
        previous.set(edge.target, currentKey);
      }
    }
  }

  // Path reconstruction
  const path: [number, number][] = [];
  let current: string | null = endKey;

  // If there's no path to the target node
  if (distances.get(endKey) === Infinity) {
    return null;
  }

  while (current !== null) {
    const nodeVal = graph.get(current)!.node;
    path.unshift([nodeVal.lng, nodeVal.lat]);
    current = previous.get(current) || null;
  }

  return {
    path,
    distance: distances.get(endKey)!,
  };
}
