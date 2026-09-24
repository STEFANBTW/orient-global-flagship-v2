/**
 * apps/api/src/controllers/searchController.js
 *
 * Handles POI and building search.
 *
 * Strategy (both run in a single SQL query):
 *   1. Text match — ILIKE '%query%' on name, description, category
 *   2. Spatial bias — results near the user's location ranked first
 *      (if the caller provides "lat" and "lng" query params)
 *
 * Note on vector/semantic search:
 *   The pois table has an embedding VECTOR(384) column.
 *   Full semantic search requires generating an embedding for the query text
 *   using an embedding model (e.g. all-MiniLM-L6-v2 via a Python microservice
 *   or a Node-compatible ONNX runtime).
 *   That integration is out of scope for this PRD phase.
 *   This controller implements the text fallback that works right now.
 */

import { query } from '../db/pool.js'

/**
 * GET /api/search
 *
 * Query parameters:
 *   q    — search string (required)
 *   lat  — user latitude  (optional, for proximity sorting)
 *   lng  — user longitude (optional, for proximity sorting)
 *   campus — filter by campus: main|permanent|city (optional)
 *   limit  — max results (default 20, max 50)
 *
 * Returns:
 *   Array of { id, type, name, campus, category, description, geom, distance_m }
 *   where `type` is 'poi' or 'building' and `distance_m` is null if no user coords given.
 */
export async function search(req, res) {
  const q      = req.query.get('q')?.trim()
  const lat    = req.query.get('lat')
  const lng    = req.query.get('lng')
  const campus = req.query.get('campus')
  const limit  = Math.min(parseInt(req.query.get('limit') || '20', 10), 50)

  if (!q || q.length < 2) {
    return res.error('Query param "q" is required and must be at least 2 characters', 400)
  }

  const hasLocation = lat && lng && !isNaN(Number(lat)) && !isNaN(Number(lng))

  try {
    // ── Build the query ──────────────────────────────────────────────────────
    // We UNION pois and buildings so search covers both tables in one query.
    // When user coordinates are provided, we compute distance and sort by it.
    //
    // ST_Distance returns distance in metres (using ::geography cast).
    // ST_AsGeoJSON converts the PostGIS geometry to a GeoJSON object.

    const params = [`%${q}%`, limit]
    let campusClause = ''

    if (campus) {
      params.push(campus)
      campusClause = `AND campus = $${params.length}`
    }

    let distanceExpr = 'NULL::numeric AS distance_m'
    let orderExpr    = 'name ASC'

    if (hasLocation) {
      // Insert the user coordinates as the next params
      params.push(Number(lng), Number(lat))
      const lngIdx = params.length - 1
      const latIdx = params.length

      distanceExpr = `
        ST_Distance(
          geom::geography,
          ST_SetSRID(ST_MakePoint($${lngIdx}, $${latIdx}), 4326)::geography
        ) AS distance_m
      `
      orderExpr = 'distance_m ASC NULLS LAST'
    }

    const sql = `
      SELECT
        id,
        'poi'::text    AS type,
        name,
        campus,
        category,
        description,
        ST_AsGeoJSON(geom)::json AS geom,
        ${distanceExpr}
      FROM pois
      WHERE (
        name        ILIKE $1 OR
        description ILIKE $1 OR
        category    ILIKE $1
      )
      ${campusClause}

      UNION ALL

      SELECT
        id,
        'building'::text AS type,
        name,
        campus,
        category,
        description,
        ST_AsGeoJSON(ST_Centroid(geom))::json AS geom,
        ${distanceExpr}
      FROM buildings
      WHERE (
        name        ILIKE $1 OR
        description ILIKE $1 OR
        category    ILIKE $1
      )
      ${campusClause}

      ORDER BY ${orderExpr}
      LIMIT $2
    `

    const result = await query(sql, params)
    res.json(result.rows)

  } catch (err) {
    console.error('[searchController] search error:', err)
    res.error('Search failed', 500)
  }
}
