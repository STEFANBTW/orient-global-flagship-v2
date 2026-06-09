/**
 * UJ3DMap Client-Side Offline Routing Engine
 * Implements graph building and Dijkstra's algorithm for pathfinding.
 */

// Haversine formula to compute distance between two coordinates in meters
export function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000 // Radius of the Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Builds an adjacency list graph from GeoJSON LineStrings
 * @param {Array} features - GeoJSON features representing roads and walkways
 * @returns {Object} Graph adjacency list
 */
export function buildGraph(features) {
  const graph = {}

  features.forEach((feature) => {
    if (feature.geometry.type !== 'LineString') return

    const coordinates = feature.geometry.coordinates // Array of [lng, lat]
    const properties = feature.properties || {}
    
    // Allowed travel modes for this segment (default to all if not specified)
    const allowedModes = properties.allowed_modes || ['pedestrian', 'bicycle', 'vehicle', 'indoor']
    const isIndoor = properties.is_indoor || false
    const floorLevel = properties.floor_level !== undefined ? properties.floor_level : null
    const buildingId = properties.building_id || null
    const name = properties.name || 'Unnamed path'

    for (let i = 0; i < coordinates.length - 1; i++) {
      const p1 = coordinates[i]
      const p2 = coordinates[i + 1]

      const key1 = `${p1[1].toFixed(6)},${p1[0].toFixed(6)}`
      const key2 = `${p2[1].toFixed(6)},${p2[0].toFixed(6)}`

      const dist = getDistanceMeters(p1[1], p1[0], p2[1], p2[0])

      if (!graph[key1]) graph[key1] = []
      if (!graph[key2]) graph[key2] = []

      // Add bi-directional edges (symmetric graph)
      graph[key1].push({
        node: key2,
        dist: dist,
        modes: allowedModes,
        isIndoor,
        floorLevel,
        buildingId,
        name
      })

      graph[key2].push({
        node: key1,
        dist: dist,
        modes: allowedModes,
        isIndoor,
        floorLevel,
        buildingId,
        name
      })
    }
  })

  return graph
}

/**
 * Finds the nearest node in the graph to a given target coordinate
 */
export function findNearestNode(graph, lat, lng) {
  let minDistance = Infinity
  let nearestNode = null

  for (const nodeKey of Object.keys(graph)) {
    const [nodeLat, nodeLng] = nodeKey.split(',').map(Number)
    const dist = getDistanceMeters(lat, lng, nodeLat, nodeLng)
    if (dist < minDistance) {
      minDistance = dist
      nearestNode = nodeKey
    }
  }

  return nearestNode
}

/**
 * Dijkstra's algorithm to compute shortest path
 * @param {Object} graph - Adjacency list graph
 * @param {string} startNode - Key of start node ("lat,lng")
 * @param {string} endNode - Key of end node ("lat,lng")
 * @param {string} mode - Travel mode: 'pedestrian', 'bicycle', 'vehicle'
 * @returns {Object|null} Path coordinates, distance, and direction steps
 */
export function findShortestPath(graph, startNode, endNode, mode = 'pedestrian') {
  if (!graph[startNode] || !graph[endNode]) return null

  const distances = {}
  const previous = {}
  const queue = new Set()

  // Initialize
  for (const node of Object.keys(graph)) {
    distances[node] = Infinity
    previous[node] = null
    queue.add(node)
  }
  distances[startNode] = 0

  while (queue.size > 0) {
    // Find node with minimum distance in queue
    let minDistance = Infinity
    let currentNode = null

    for (const node of queue) {
      if (distances[node] < minDistance) {
        minDistance = distances[node]
        currentNode = node
      }
    }

    if (currentNode === null || currentNode === endNode) {
      break // End node reached or unreachable remaining nodes
    }

    queue.delete(currentNode)

    // Traverse neighbors
    const neighbors = graph[currentNode] || []
    for (const edge of neighbors) {
      // Filter out edges that do not support selected travel mode
      if (!edge.modes.includes(mode)) continue

      const alt = distances[currentNode] + edge.dist
      if (alt < distances[edge.node]) {
        distances[edge.node] = alt
        previous[edge.node] = {
          node: currentNode,
          name: edge.name,
          dist: edge.dist,
          isIndoor: edge.isIndoor,
          floorLevel: edge.floorLevel
        }
      }
    }
  }

  // Path reconstruction
  if (distances[endNode] === Infinity) return null // Path not found

  const pathCoords = []
  let curr = endNode
  const edgesTraversed = []

  while (curr !== null) {
    const [lat, lng] = curr.split(',').map(Number)
    pathCoords.unshift([lat, lng])
    
    const prevEdge = previous[curr]
    if (prevEdge) {
      edgesTraversed.unshift(prevEdge)
      curr = prevEdge.node
    } else {
      curr = null
    }
  }

  // Generate turn-by-turn text descriptions
  const steps = generateSteps(edgesTraversed, mode)

  return {
    coordinates: pathCoords, // Array of [lat, lng]
    distance: distances[endNode], // In meters
    steps: steps
  }
}

/**
 * Generates descriptive step-by-step instructions from traversed edges
 */
function generateSteps(edges, mode) {
  if (edges.length === 0) return ['You have arrived at your destination.']

  const steps = []
  let currentPathName = edges[0].name
  let currentDistance = 0
  let currentIndoorState = edges[0].isIndoor
  let currentFloor = edges[0].floorLevel

  steps.push(`Start travelling by ${mode === 'pedestrian' ? 'walking' : mode === 'bicycle' ? 'riding' : 'driving'} on ${currentPathName}.`)

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i]
    currentDistance += edge.dist

    // Detect transitions
    const nameChange = edge.name !== currentPathName
    const floorChange = edge.floorLevel !== currentFloor && edge.floorLevel !== null && currentFloor !== null
    const indoorChange = edge.isIndoor !== currentIndoorState

    if (nameChange || floorChange || indoorChange) {
      if (currentDistance > 10) {
        steps.push(`Continue along ${currentPathName} for ${Math.round(currentDistance)} meters.`)
      }

      if (floorChange) {
        const direction = edge.floorLevel > currentFloor ? 'up' : 'down'
        steps.push(`Take the stairs or elevator ${direction} to Floor ${edge.floorLevel}.`)
      } else if (indoorChange) {
        steps.push(edge.isIndoor ? `Enter the building corridors.` : `Exit the building to outdoors.`);
      } else if (nameChange) {
        steps.push(`Turn onto ${edge.name}.`)
      }

      currentPathName = edge.name
      currentFloor = edge.floorLevel
      currentIndoorState = edge.isIndoor
      currentDistance = 0
    }
  }

  // Add final step
  if (currentDistance > 0) {
    steps.push(`Proceed ${Math.round(currentDistance)} meters on ${currentPathName}.`)
  }
  steps.push('You have arrived at your destination.')

  return steps
}
