/**
 * apps/api/src/services/geojsonImport.js
 *
 * Bulk-imports a GeoJSON FeatureCollection into the PostGIS database.
 * Used by adminController.js when an admin uploads a QGIS / JOSM export.
 *
 * Feature routing:
 *   feature.properties.type === 'building' → buildings table
 *   feature.properties.type === 'poi'      → pois table
 *   feature.properties.type === 'path'     → paths table
 *
 * All inserts run inside a single transaction.
 * If any individual feature fails, it is logged and skipped — the rest continue.
 */

import { pool } from '../db/pool.js'

/**
 * Imports a GeoJSON FeatureCollection into PostGIS.
 *
 * @param {object} featureCollection — parsed GeoJSON FeatureCollection
 * @param {string} importedBy        — user UUID (for the log)
 *
 * @returns {{ imported: number, errors: Array }}
 */
export async function importFeatureCollection(featureCollection, importedBy) {
  const client = await pool.connect() // Grab a dedicated client for the transaction
  const errors  = []
  let imported  = 0

  try {
    await client.query('BEGIN')

    for (const feature of featureCollection.features) {
      try {
        await importFeature(client, feature)
        imported++
      } catch (err) {
        // Individual feature failure — log and continue rather than aborting all
        errors.push({
          feature: feature.properties?.name || '(unnamed)',
          reason:  err.message,
        })
        console.warn('[geojsonImport] Skipped feature:', feature.properties?.name, '—', err.message)
      }
    }

    await client.query('COMMIT')

  } catch (err) {
    await client.query('ROLLBACK')
    throw err  // Re-throw transaction-level errors to the controller

  } finally {
    client.release() // Always return the connection to the pool
  }

  return { imported, errors }
}

/**
 * Routes a single GeoJSON Feature to the correct insert function.
 * Throws if the feature type is missing or unrecognised.
 */
async function importFeature(client, feature) {
  if (!feature.geometry) throw new Error('Feature has no geometry')

  const type = feature.properties?.type

  switch (type) {
    case 'building': return insertBuilding(client, feature)
    case 'poi':      return insertPoi(client, feature)
    case 'path':     return insertPath(client, feature)
    default:
      throw new Error(
        `Unknown feature type: "${type}". Must be "building", "poi", or "path".`
      )
  }
}

// ─── Individual insert functions ──────────────────────────────────────────────

async function insertBuilding(client, feature) {
  const p = feature.properties

  await client.query(
    `INSERT INTO buildings (name, campus, category, description, height, geom)
     VALUES ($1, $2, $3, $4, $5, ST_GeomFromGeoJSON($6))
     ON CONFLICT DO NOTHING`,
    [
      p.name        || 'Unnamed Building',
      p.campus      || 'main',
      p.category    || 'unknown',
      p.description || null,
      p.height      || 0,
      JSON.stringify(feature.geometry),
    ]
  )
}

async function insertPoi(client, feature) {
  const p = feature.properties

  await client.query(
    `INSERT INTO pois (name, campus, category, description, floor_level,
                       photo_day_url, photo_night_url, geom)
     VALUES ($1, $2, $3, $4, $5, $6, $7, ST_GeomFromGeoJSON($8))
     ON CONFLICT DO NOTHING`,
    [
      p.name            || 'Unnamed POI',
      p.campus          || 'main',
      p.category        || 'unknown',
      p.description     || null,
      p.floor_level     || 0,
      p.photo_day_url   || null,
      p.photo_night_url || null,
      JSON.stringify(feature.geometry),
    ]
  )
}

async function insertPath(client, feature) {
  const p = feature.properties

  // Parse allowed_modes: QGIS may export as a comma-string or JSON array
  let allowedModes = ['pedestrian', 'bicycle', 'vehicle']
  if (Array.isArray(p.allowed_modes)) {
    allowedModes = p.allowed_modes
  } else if (typeof p.allowed_modes === 'string') {
    allowedModes = p.allowed_modes.split(',').map(m => m.trim())
  }

  await client.query(
    `INSERT INTO paths (name, campus, allowed_modes, is_indoor, floor_level, geom)
     VALUES ($1, $2, $3, $4, $5, ST_GeomFromGeoJSON($6))
     ON CONFLICT DO NOTHING`,
    [
      p.name          || 'Unnamed Path',
      p.campus        || 'main',
      allowedModes,
      p.is_indoor     || false,
      p.floor_level   || null,
      JSON.stringify(feature.geometry),
    ]
  )
}
