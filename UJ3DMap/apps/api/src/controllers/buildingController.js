/**
 * apps/api/src/controllers/buildingController.js
 *
 * CRUD handlers for campus buildings.
 * All spatial data is read from PostGIS using ST_AsGeoJSON() so the
 * geometry comes back as a GeoJSON string ready for MapLibre GL.
 */

import { query } from '../db/pool.js'

// ─── Select projection ─────────────────────────────────────────────────────
// We always return GeoJSON-ready geometry. ST_AsGeoJSON converts PostGIS
// geometry to a JSON string; we parse it so the final response is clean JSON.

const SELECT_COLUMNS = `
  id,
  name,
  campus,
  category,
  description,
  height,
  ST_AsGeoJSON(geom)::json AS geom,
  created_at,
  updated_at
`

// ─── Handlers ─────────────────────────────────────────────────────────────────

/**
 * GET /api/buildings
 * Query params:
 *   ?campus=main|permanent|city   (optional filter)
 *   ?category=faculty|admin|...   (optional filter)
 *
 * Returns an array of building objects with GeoJSON geometry.
 */
export async function getAll(req, res) {
  try {
    const campus   = req.query.get('campus')
    const category = req.query.get('category')

    // Build a dynamic WHERE clause only for params that were actually provided.
    // We use parameterised queries ($1, $2) to prevent SQL injection.
    const conditions = []
    const params     = []

    if (campus) {
      params.push(campus)
      conditions.push(`campus = $${params.length}`)
    }
    if (category) {
      params.push(category)
      conditions.push(`category = $${params.length}`)
    }

    const where = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : ''

    const result = await query(
      `SELECT ${SELECT_COLUMNS} FROM buildings ${where} ORDER BY name ASC`,
      params
    )

    res.json(result.rows)

  } catch (err) {
    console.error('[buildingController] getAll error:', err)
    res.error('Failed to fetch buildings')
  }
}

/**
 * GET /api/buildings/:id
 * Returns a single building by UUID.
 * Also returns associated POIs via a lateral join.
 */
export async function getById(req, res, params) {
  try {
    const result = await query(
      `SELECT ${SELECT_COLUMNS} FROM buildings WHERE id = $1`,
      [params.id]
    )

    if (result.rows.length === 0) {
      return res.error('Building not found', 404)
    }

    // Also fetch the POIs associated with this building
    const poisResult = await query(
      `SELECT id, name, category, description, floor_level,
              photo_day_url, photo_night_url,
              ST_AsGeoJSON(geom)::json AS geom
       FROM pois
       WHERE building_id = $1
       ORDER BY floor_level ASC, name ASC`,
      [params.id]
    )

    const building = result.rows[0]
    building.pois  = poisResult.rows

    res.json(building)

  } catch (err) {
    console.error('[buildingController] getById error:', err)
    res.error('Failed to fetch building')
  }
}

/**
 * POST /api/buildings  (admin only — checkAuth runs in route registration)
 * Body: GeoJSON Feature with properties { name, campus, category, description, height }
 * Inserts a single building from a GeoJSON Feature object.
 */
export async function create(req, res) {
  const feature = req.body

  if (!feature || feature.type !== 'Feature' || !feature.geometry) {
    return res.error('Request body must be a GeoJSON Feature', 400)
  }

  const { name, campus, category, description, height = 0 } = feature.properties || {}

  if (!name || !campus || !category) {
    return res.error('properties.name, campus, and category are required', 400)
  }

  try {
    const result = await query(
      `INSERT INTO buildings (name, campus, category, description, height, geom)
       VALUES ($1, $2, $3, $4, $5, ST_GeomFromGeoJSON($6))
       RETURNING id`,
      [name, campus, category, description || null, height,
       JSON.stringify(feature.geometry)]
    )

    res.json({ id: result.rows[0].id, message: 'Building created' }, 201)

  } catch (err) {
    console.error('[buildingController] create error:', err)
    res.error('Failed to create building')
  }
}

/**
 * DELETE /api/buildings/:id  (admin only)
 */
export async function remove(req, res, params) {
  try {
    const result = await query(
      'DELETE FROM buildings WHERE id = $1 RETURNING id',
      [params.id]
    )

    if (result.rows.length === 0) {
      return res.error('Building not found', 404)
    }

    res.json({ message: 'Building deleted' })

  } catch (err) {
    console.error('[buildingController] remove error:', err)
    res.error('Failed to delete building')
  }
}
