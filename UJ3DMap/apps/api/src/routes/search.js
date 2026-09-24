/**
 * apps/api/src/routes/search.js
 *
 * Registers the search route.
 */

import { router }  from '../router.js'
import { search }  from '../controllers/searchController.js'

// Public — search is accessible to all users
router.get('/api/search', search)
