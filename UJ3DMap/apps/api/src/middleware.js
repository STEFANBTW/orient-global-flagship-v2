/**
 * apps/api/src/middleware.js
 *
 * A hand-written middleware chain — ~80 lines of actual logic.
 *
 * What this replaces:
 *   - cors npm package          → setCORS()
 *   - express.json()            → parseBody()
 *   - express query parsing     → parseQuery()
 *   - express-jwt / passport    → checkAuth()
 *   - res.json() in Express     → attachResponseHelpers()
 *
 * applyMiddleware() is called on EVERY request in server.js.
 * checkAuth() is exported separately and called only on protected routes.
 */

import jwt from 'jsonwebtoken'

// ─── 1. Response helpers ─────────────────────────────────────────────────────
// We attach these to the `res` object so every handler can call res.json()
// and res.error() without needing to remember writeHead/end boilerplate.
//
// This is exactly what Express's res.json() does — two functions.

function attachResponseHelpers(res) {
  res.json = (data, status = 200) => {
    // Guard: do not write headers twice (e.g. if middleware already responded)
    if (res.headersSent) return
    res.writeHead(status, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(data))
  }

  res.error = (message, status = 500) => {
    res.json({ error: message }, status)
  }
}

// ─── 2. CORS ─────────────────────────────────────────────────────────────────
// Browsers enforce the Same-Origin Policy — they block frontend JS from calling
// an API on a different port (e.g. :5173 → :3001) unless the server opts in.
// These headers tell the browser: "Yes, this API is open to cross-origin calls."

function setCORS(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  // Cache preflight for 24 h — reduces OPTIONS requests
  res.setHeader('Access-Control-Max-Age', '86400')
}

// ─── 3. Query string parser ───────────────────────────────────────────────────
// Parses the query string portion of the URL and attaches it to req.query
// as a URLSearchParams object (built into Node/browsers).
//
// Usage in a handler: req.query.get('campus')   → 'main'
//                     req.query.get('q')         → 'library'

function parseQuery(req) {
  // URL class requires an absolute URL — we use a dummy host
  const urlObj = new URL(req.url, 'http://localhost')
  req.query = urlObj.searchParams
}

// ─── 4. Body parser ───────────────────────────────────────────────────────────
// Reads the request body stream (chunks of binary data) into a string,
// then JSON-parses it. This is exactly what express.json() does internally.
//
// Returns a Promise because stream reading is asynchronous.
// Only runs for methods that conventionally carry a body (POST, PUT, PATCH).

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const method = req.method.toUpperCase()

    if (!['POST', 'PUT', 'PATCH'].includes(method)) {
      req.body = null
      return resolve()
    }

    const contentType = req.headers['content-type'] || ''
    if (!contentType.includes('application/json')) {
      req.body = null
      return resolve()
    }

    let raw = ''

    req.on('data', (chunk) => {
      raw += chunk.toString()
      // Safety limit: reject bodies larger than 10 MB
      if (raw.length > 10 * 1024 * 1024) {
        req.destroy()
        reject(new Error('Request body too large'))
      }
    })

    req.on('end', () => {
      try {
        req.body = raw ? JSON.parse(raw) : null
        resolve()
      } catch {
        req.body = null
        resolve() // Non-fatal — handler will deal with malformed body
      }
    })

    req.on('error', reject)
  })
}

// ─── 5. Request logger ───────────────────────────────────────────────────────
// Logs method, path, and response status to stdout.
// Hooks into res.writeHead to capture the status code after the fact.

function logRequest(req, res) {
  const start   = Date.now()
  const origEnd = res.end.bind(res)

  res.end = (...args) => {
    const ms = Date.now() - start
    console.log(`[api] ${req.method} ${req.url} → ${res.statusCode} (${ms}ms)`)
    origEnd(...args)
  }
}

// ─── applyMiddleware — runs on every request ──────────────────────────────────
// The order matters:
//   1. Attach response helpers first (so anything below can call res.error())
//   2. Set CORS headers (must be before any response is sent)
//   3. Log (wraps res.end so it captures the final status)
//   4. Parse query string (sync, cheap)
//   5. Parse body (async, only for POST/PUT/PATCH)

export async function applyMiddleware(req, res) {
  attachResponseHelpers(res)
  setCORS(req, res)
  logRequest(req, res)
  parseQuery(req)
  await parseBody(req)
}

// ─── checkAuth — call explicitly on protected routes only ────────────────────
// Reads the Authorization header, verifies the JWT, attaches req.user.
// Returns false and sends 401 if invalid — handler should return early.
//
// Usage in a route handler:
//   if (!await checkAuth(req, res)) return

export async function checkAuth(req, res) {
  const authHeader = req.headers.authorization || ''

  if (!authHeader.startsWith('Bearer ')) {
    res.error('Missing or malformed Authorization header', 401)
    return false
  }

  const token = authHeader.slice(7) // strip 'Bearer '

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // { id, email, role, iat, exp }
    return true
  } catch (err) {
    const message = err.name === 'TokenExpiredError'
      ? 'Token expired — please log in again'
      : 'Invalid token'
    res.error(message, 401)
    return false
  }
}
