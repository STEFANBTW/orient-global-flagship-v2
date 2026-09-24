/**
 * apps/api/src/services/graphhopper.js
 *
 * GraphHopper integration service.
 *
 * GraphHopper is a self-hosted Java routing engine that understands OpenStreetMap
 * data. It is far more powerful than client-side Dijkstra because:
 *   - It processes the full OSM road network for the entire city
 *   - It supports turn restrictions, traffic signals, and one-way streets
 *   - It calculates elevation, duration estimates, and turn-by-turn instructions
 *   - It runs as a persistent server so the graph is loaded into RAM once
 *
 * How to run GraphHopper locally (one-time setup):
 *   1. Download: https://github.com/graphhopper/graphhopper/releases
 *      → graphhopper-web-*.jar
 *   2. Download Nigeria OSM extract:
 *      → https://download.geofabrik.de/africa/nigeria-latest.osm.pbf
 *   3. Start:
 *      java -jar graphhopper-web-*.jar server config.yml
 *      (config.yml must point to nigeria-latest.osm.pbf)
 *   4. GraphHopper will be available at http://localhost:8989
 *
 * This file is the ONLY place in the codebase that talks to GraphHopper.
 * All other code calls queryGraphHopper() and receives clean GeoJSON back.
 */

// Profile mapping: our internal mode names → GraphHopper vehicle profiles
// GraphHopper ships with these profiles out of the box.
const PROFILE_MAP = {
  pedestrian: 'foot',
  bicycle:    'bike',
  vehicle:    'car',
  indoor:     'foot',  // Indoor routing falls back to foot — GH doesn't model indoors
}

/**
 * Queries the self-hosted GraphHopper REST API for a route.
 *
 * @param {[number, number]} fromCoord  — [latitude, longitude]
 * @param {[number, number]} toCoord    — [latitude, longitude]
 * @param {string}           mode       — 'pedestrian' | 'bicycle' | 'vehicle' | 'indoor'
 *
 * @returns {Promise<{
 *   geometry:     object,    // GeoJSON LineString
 *   distance:     number,    // metres
 *   time:         number,    // milliseconds
 *   instructions: Array      // turn-by-turn step objects
 * }>}
 *
 * @throws {Error} if GraphHopper is unreachable or returns no path
 */
export async function queryGraphHopper(fromCoord, toCoord, mode = 'pedestrian') {
  const baseUrl = process.env.GRAPHHOPPER_BASE_URL || 'http://localhost:8989'
  const profile = PROFILE_MAP[mode] || 'foot'

  // GraphHopper route API format:
  //   /route?point=lat,lng&point=lat,lng&profile=foot&points_encoded=false&locale=en
  //
  // points_encoded=false → return GeoJSON coordinates (not the compressed polyline format)
  // instructions=true    → include turn-by-turn steps
  const url = new URL('/route', baseUrl)
  url.searchParams.append('point',   `${fromCoord[0]},${fromCoord[1]}`)
  url.searchParams.append('point',   `${toCoord[0]},${toCoord[1]}`)
  url.searchParams.append('profile', profile)
  url.searchParams.append('points_encoded', 'false')
  url.searchParams.append('instructions',   'true')
  url.searchParams.append('locale',         'en')

  let response
  try {
    // Node 18+ ships with native fetch — no node-fetch needed
    response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      // 10-second timeout using AbortController (built into Node 18+)
      signal: AbortSignal.timeout(10_000),
    })
  } catch (err) {
    // Network error — GraphHopper is not running or not reachable
    throw new Error(
      `GraphHopper is unreachable at ${baseUrl}. ` +
      `Ensure the Java service is running. Original error: ${err.message}`
    )
  }

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`GraphHopper returned HTTP ${response.status}: ${body}`)
  }

  const data = await response.json()

  // GraphHopper returns `paths` — an array of alternative routes.
  // We always take the first (best) one.
  if (!data.paths || data.paths.length === 0) {
    throw new Error('GraphHopper found no path between the given coordinates')
  }

  const path = data.paths[0]

  // Normalise the response into our internal format
  return {
    // GeoJSON LineString geometry — ready to pass directly to MapLibre
    geometry: path.points,

    // Distance in metres
    distance: path.distance,

    // Duration in milliseconds
    time: path.time,

    // Turn-by-turn instructions — normalised to a simpler shape
    instructions: (path.instructions || []).map((step) => ({
      text:     step.text,
      distance: step.distance,           // metres for this step
      time:     step.time,               // ms for this step
      sign:     step.sign,               // GH sign codes: 0=continue, 2=right, -2=left, etc.
      interval: step.interval,           // [startIndex, endIndex] into geometry.coordinates
    })),
  }
}
