/**
 * apps/api/src/routes/admin.js
 *
 * Registers admin-only routes.
 * Every handler here goes through checkAuth.
 */

import { router }     from '../router.js'
import { checkAuth }  from '../middleware.js'
import {
  importGeoJSON,
  getPendingVideos,
  moderateVideo,
} from '../controllers/adminController.js'

// Inline auth guard — wraps every handler so we don't repeat ourselves
function adminRoute(handler) {
  return async (req, res, params) => {
    if (!await checkAuth(req, res)) return
    // Optional: require admin role (not just any authenticated user)
    if (req.user.role !== 'admin') {
      return res.error('Forbidden: admin role required', 403)
    }
    await handler(req, res, params)
  }
}

router.post('/api/admin/import',      adminRoute(importGeoJSON))
router.get('/api/admin/videos',       adminRoute(getPendingVideos))
router.patch('/api/admin/videos/:id', adminRoute(moderateVideo))
