/**
 * apps/api/src/routes/auth.js
 *
 * Registers authentication routes onto the router.
 * Side-effect import — called once from server.js.
 */

import { router }         from '../router.js'
import { checkAuth }      from '../middleware.js'
import { login, me }      from '../controllers/authController.js'

// Public — no auth required
router.post('/api/auth/login', login)

// Protected — user must be logged in
router.get('/api/auth/me', async (req, res, params) => {
  if (!await checkAuth(req, res)) return
  await me(req, res, params)
})
