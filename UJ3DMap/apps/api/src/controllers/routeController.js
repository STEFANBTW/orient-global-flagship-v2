/**
 * apps/api/src/controllers/routeController.js
 *
 * Handles routing requests by proxying to the self-hosted GraphHopper instance.
 *
 * Why proxy instead of calling GraphHopper from the browser directly?
 *   1. CORS — GraphHopper does not set CORS headers by default
 *   2. Security — keeps the GraphHopper port (8989) off the public internet
 *   3. Control — we can log, throttle, or swap the routing engine later
 *   4. Augmentation — we stitch outdoor GraphHopper routes with indoor path
 *      data from PostGIS (indoor routing is not in OSM)
 *
 * Offline fallback:
 *   The frontend still has the client-side Dijkstra in src/utils/routing.js.
 *   If this endpoint returns an error, the frontend degrades gracefully.
 */

import { queryGraphHopper }  from '../services/graphhopper.js'
import { query }             from '../db/pool.js'

/**
 * GET /api/route
 *
 * Query parameters:
 *   from   — "lat,lng"   (e.g. "9.952,8.892")
 *   to     — "lat,lng"   (e.g. "9.960,8.900")
 *   mode   — pedestrian | bicycle | vehicle | indoor  (default: pedestrian)
 *
 * Response:
 *   {
 *     geometry:     GeoJSON LineString,
 *     distance:     number (metres),
 *     time:         number (milliseconds),
 *     instructions: [ { text, distance, time, sign } ],
 *     source:       "graphhopper" | "indoor_stitched"
 *   }
 */
export async function getRoute(req, res) {
  // ── Parse and validate inputs ──────────────────────────────────────────────
  const fromStr = req.query.get('from')
  const toStr   = req.query.get('to')
  const mode    = req.query.get('mode') || 'pedestrian'

  if (!fromStr || !toStr) {
    return res.error('Query params "from" and "to" are required (format: lat,lng)', 400)
  }

  const fromCoord = fromStr.split(',').map(Number)
  const toCoord   = toStr.split(',').map(Number)

  if (fromCoord.length !== 2 || fromCoord.some(isNaN) ||
      toCoord.length   !== 2 || toCoord.some(isNaN)) {
    return res.error('"from" and "to" must be in "lat,lng" format with valid numbers', 400)
  }

  const validModes = ['pedestrian', 'bicycle', 'vehicle', 'indoor']
  if (!validModes.includes(mode)) {
    return res.error(`"mode" must be one of: ${validModes.join(', ')}`, 400)
  }

  // ── Mode: indoor — route entirely inside PostGIS path network ──────────────
  if (mode === 'indoor') {
    return getIndoorRoute(req, res, fromCoord, toCoord)
  }

  // ── Mode: outdoor — proxy to GraphHopper ───────────────────────────────────
  try {
    const route = await queryGraphHopper(fromCoord, toCoord, mode)

    res.json({
      geometry:     route.geometry,
      distance:     route.distance,
      time:         route.time,
      instructions: route.instructions,
      source:       'graphhopper',
    })

  } catch (err) {
    console.error('[routeController] GraphHopper error:', err.message)

    // Return a structured error so the frontend can fall back to
    // client-side Dijkstra gracefully rather than showing a blank screen.
    res.json({
      error:      err.message,
      source:     'graphhopper',
      fallback:   true,   // Signal to the frontend to use offline Dijkstra
    }, 503)
  }
}

/**
 * Indoor routing — queries the campus path network from PostGIS.
 * Used when mode=indoor (navigating inside a building between floors/rooms).
 *
 * Uses PostGIS pgRouting functions if available, otherwise returns raw path
 * geometry as a LineString for the frontend to stitch.
 *
 * Returns the raw indoor path segments near the start/end coordinates.
 * The frontend stitches these with the outdoor route endpoint.
 */
async function getIndoorRoute(req, res, fromCoord, toCoord) {
  try {
    // Find indoor path segments within 50 metres of both endpoints.
    // ST_DWithin uses the spatial index for fast lookup.
    const result = await query(
      `SELECT
         id,
         name,
         floor_level,
         allowed_modes,
         ST_AsGeoJSON(geom)::json AS geom,
         ST_Length(geom::geography) AS length_m
       FROM paths
       WHERE is_indoor = true
         AND (
           ST_DWithin(
             geom::geography,
             ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
             50
           )
           OR
           ST_DWithin(
             geom::geography,
             ST_SetSRID(ST_MakePoint($3, $4), 4326)::geography,
             50
           )
         )
       ORDER BY floor_level ASC`,
      // Note: ST_MakePoint takes (lng, lat) — longitude first
      [fromCoord[1], fromCoord[0], toCoord[1], toCoord[0]]
    )

    res.json({
      segments:  result.rows,
      source:    'indoor_stitched',
      from:      fromCoord,
      to:        toCoord,
    })

  } catch (err) {
    console.error('[routeController] indoor route error:', err.message)
    res.error('Failed to compute indoor route', 500)
  }
}
