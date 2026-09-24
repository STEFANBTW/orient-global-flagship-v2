/**
 * apps/api/src/router.js
 *
 * A hand-written URL router — ~60 lines.
 *
 * What this replaces: express Router, Fastify, Koa Router, etc.
 * What it does:
 *   - Maintains a list of registered routes
 *   - Matches incoming requests against those routes
 *   - Extracts named URL parameters (e.g. :id)
 *   - Calls the matched handler with (req, res, params)
 *   - Responds 404 / 405 automatically
 *
 * Usage:
 *   import { router } from './router.js'
 *   router.get('/api/buildings/:id', myHandler)
 *   router.post('/api/buildings',    myHandler)
 *
 * Handler signature: async function handler(req, res, params) {}
 *   req.query  — URLSearchParams  (set by middleware)
 *   req.body   — parsed JSON body  (set by middleware)
 *   res.json() — send JSON response (set by middleware)
 *   res.error()— send error response (set by middleware)
 *   params     — { id: 'law-001' }  (set by this router)
 */

// The route registry: an array of route descriptor objects.
const routes = []

/**
 * Attempts to match a URL pathname against a route pattern.
 *
 * Pattern:  '/api/buildings/:id'
 * Pathname: '/api/buildings/law-001'
 * Returns:  { id: 'law-001' }   on success
 * Returns:  null                on failure
 *
 * Algorithm:
 *   1. Split both by '/'
 *   2. If segment counts differ → no match
 *   3. Walk each segment pair:
 *      - If pattern segment starts with ':' → capture as param
 *      - Otherwise → must match exactly (case-sensitive)
 */
function matchPattern(pattern, pathname) {
  const patternParts  = pattern.split('/').filter(Boolean)
  const pathnameParts = pathname.split('/').filter(Boolean)

  if (patternParts.length !== pathnameParts.length) return null

  const params = {}

  for (let i = 0; i < patternParts.length; i++) {
    const pPart = patternParts[i]
    const uPart = pathnameParts[i]

    if (pPart.startsWith(':')) {
      // Named parameter — capture it
      params[pPart.slice(1)] = decodeURIComponent(uPart)
    } else if (pPart !== uPart) {
      // Literal segment mismatch → no match
      return null
    }
  }

  return params
}

/**
 * Core router function — called once per HTTP request.
 * Iterates the route registry and dispatches on first match.
 */
async function router(req, res) {
  // Parse just the pathname (strip query string) using the built-in URL class
  const { pathname } = new URL(req.url, 'http://localhost')
  const method       = req.method.toUpperCase()

  // Handle CORS preflight — already had headers set in middleware
  if (method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  let methodMismatch = false

  for (const route of routes) {
    const params = matchPattern(route.pattern, pathname)

    if (params === null) continue  // pathname does not match this pattern

    if (route.method !== method) {
      // Pathname matched but method wrong — keep looking, note the mismatch
      methodMismatch = true
      continue
    }

    // Full match — call the handler
    await route.handler(req, res, params)
    return
  }

  // Nothing matched
  if (methodMismatch) {
    res.error('Method not allowed', 405)
  } else {
    res.error(`Cannot ${method} ${pathname}`, 404)
  }
}

/**
 * Route registration helpers.
 * These are the only public API of this module.
 */
function register(method, pattern, handler) {
  routes.push({ method: method.toUpperCase(), pattern, handler })
}

router.get    = (pattern, handler) => register('GET',    pattern, handler)
router.post   = (pattern, handler) => register('POST',   pattern, handler)
router.patch  = (pattern, handler) => register('PATCH',  pattern, handler)
router.delete = (pattern, handler) => register('DELETE', pattern, handler)
router.put    = (pattern, handler) => register('PUT',    pattern, handler)

export { router }
