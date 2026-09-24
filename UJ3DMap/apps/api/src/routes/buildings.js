/**
 * apps/api/src/routes/buildings.js
 *
 * Registers building CRUD routes onto the router.
 */

import { router }      from '../router.js'
import { checkAuth }   from '../middleware.js'
import {
  getAll,
  getById,
  create,
  remove,
} from '../controllers/buildingController.js'

// Public read access
router.get('/api/buildings',     getAll)
router.get('/api/buildings/:id', getById)

// Admin-only write access
router.post('/api/buildings', async (req, res, params) => {
  if (!await checkAuth(req, res)) return
  await create(req, res, params)
})

router.delete('/api/buildings/:id', async (req, res, params) => {
  if (!await checkAuth(req, res)) return
  await remove(req, res, params)
})
