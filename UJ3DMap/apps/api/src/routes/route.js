/**
 * apps/api/src/routes/route.js
 *
 * Registers the routing endpoint.
 */

import { router }     from '../router.js'
import { getRoute }   from '../controllers/routeController.js'

// Public — routing is accessible to all users (guest, student, visitor)
router.get('/api/route', getRoute)
