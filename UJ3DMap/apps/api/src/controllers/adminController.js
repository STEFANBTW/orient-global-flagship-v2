/**
 * apps/api/src/controllers/adminController.js
 *
 * Handles bulk GeoJSON ingestion via the admin panel.
 * All routes that call these handlers must go through checkAuth first.
 *
 * This replaces the "Upload GeoJSON Maps" button placeholder in the old admin panel.
 */

import { importFeatureCollection } from '../services/geojsonImport.js'
import { query }                    from '../db/pool.js'

/**
 * POST /api/admin/import
 * Protected — requires admin JWT.
 *
 * Body: a GeoJSON FeatureCollection exported from QGIS or JOSM.
 * Each Feature must have properties.type set to:
 *   'building' | 'poi' | 'path'
 *
 * Returns:
 *   { imported: number, errors: [ { feature, reason } ] }
 */
export async function importGeoJSON(req, res) {
  const featureCollection = req.body

  // Validate the incoming body is a GeoJSON FeatureCollection
  if (
    !featureCollection ||
    featureCollection.type !== 'FeatureCollection' ||
    !Array.isArray(featureCollection.features)
  ) {
    return res.error('Request body must be a GeoJSON FeatureCollection', 400)
  }

  if (featureCollection.features.length === 0) {
    return res.error('FeatureCollection contains no features', 400)
  }

  try {
    const result = await importFeatureCollection(featureCollection, req.user.id)

    // Log the import
    await query(
      `INSERT INTO import_log (imported_by, feature_count, notes)
       VALUES ($1, $2, $3)`,
      [req.user.id, result.imported, `Errors: ${result.errors.length}`]
    )

    res.json({
      message:  `Import complete`,
      imported: result.imported,
      errors:   result.errors,
    }, result.errors.length === 0 ? 200 : 207) // 207 Multi-Status if partial success

  } catch (err) {
    console.error('[adminController] importGeoJSON error:', err)
    res.error('Import failed: ' + err.message, 500)
  }
}

/**
 * GET /api/admin/pending-videos
 * Protected — requires admin JWT.
 * Returns video guides awaiting moderation.
 */
export async function getPendingVideos(req, res) {
  try {
    const result = await query(
      `SELECT
         v.id, v.video_storage_url, v.thumbnail_url, v.duration_seconds,
         v.created_at, v.uploaded_by,
         s.name AS start_poi_name,
         e.name AS end_poi_name
       FROM video_guides v
       LEFT JOIN pois s ON s.id = v.start_poi_id
       LEFT JOIN pois e ON e.id = v.end_poi_id
       WHERE v.status = 'pending'
       ORDER BY v.created_at ASC`
    )

    res.json(result.rows)

  } catch (err) {
    console.error('[adminController] getPendingVideos error:', err)
    res.error('Failed to fetch pending videos', 500)
  }
}

/**
 * PATCH /api/admin/videos/:id
 * Protected — requires admin JWT.
 * Body: { status: 'approved' | 'rejected' }
 * Approves or rejects a pending video guide.
 */
export async function moderateVideo(req, res, params) {
  const { status } = req.body || {}

  if (!['approved', 'rejected'].includes(status)) {
    return res.error('"status" must be "approved" or "rejected"', 400)
  }

  try {
    const result = await query(
      `UPDATE video_guides SET status = $1 WHERE id = $2 RETURNING id`,
      [status, params.id]
    )

    if (result.rows.length === 0) {
      return res.error('Video not found', 404)
    }

    res.json({ message: `Video ${status}` })

  } catch (err) {
    console.error('[adminController] moderateVideo error:', err)
    res.error('Failed to update video status', 500)
  }
}
