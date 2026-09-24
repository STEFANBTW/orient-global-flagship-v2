/**
 * apps/api/server.js
 *
 * Entry point for the UJ3DMap raw Node.js HTTP server.
 * Uses ONLY Node.js core modules here — no npm packages at this layer.
 *
 * Boot sequence:
 *   1. Load env vars from .env (manual file read — no dotenv package)
 *   2. Import the custom router and middleware chain
 *   3. Create the HTTP server
 *   4. Apply middleware to every request
 *   5. Hand off to the router
 */

import { createServer }    from 'node:http'
import { readFileSync }    from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath }   from 'node:url'

// ─── Load .env manually (no dotenv package needed) ──────────────────────────
// We read the .env file as plain text and parse KEY=VALUE lines ourselves.
const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv(filePath) {
  try {
    const raw = readFileSync(filePath, 'utf8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      // Skip blank lines and comments
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim()
      // Do not overwrite vars already set in the real environment
      if (!(key in process.env)) {
        process.env[key] = val
      }
    }
  } catch {
    // .env is optional — in production, vars come from the host environment
    console.warn('[server] No .env file found — using environment variables only')
  }
}

loadEnv(resolve(__dirname, '.env'))

// ─── Import our custom modules (after env is loaded) ────────────────────────
import { applyMiddleware } from './src/middleware.js'
import { router }          from './src/router.js'

// Register all route handlers onto the router
// This import has the side-effect of calling router.get() / router.post()
import './src/routes/auth.js'
import './src/routes/buildings.js'
import './src/routes/search.js'
import './src/routes/route.js'
import './src/routes/admin.js'

// ─── Create the HTTP server ──────────────────────────────────────────────────
const PORT   = process.env.PORT || 3001

const server = createServer(async (req, res) => {
  try {
    // Step 1: Run the middleware chain on every incoming request.
    // This attaches res.json(), res.error(), req.body, req.query, and CORS headers.
    await applyMiddleware(req, res)

    // Step 2: Hand off to the router.
    // The router matches the URL pattern, extracts params, and calls the handler.
    // If nothing matches, the router sends a 404 itself.
    await router(req, res)

  } catch (err) {
    // Top-level catch: something broke in middleware or the router itself.
    console.error('[server] Unhandled error:', err)
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Internal server error' }))
    }
  }
})

server.listen(PORT, () => {
  console.log(`[server] UJ3DMap API running on http://localhost:${PORT}`)
  console.log(`[server] GraphHopper expected at ${process.env.GRAPHHOPPER_BASE_URL || 'http://localhost:8989'}`)
})

// Graceful shutdown on SIGTERM (Docker, systemd, etc.)
process.on('SIGTERM', () => {
  console.log('[server] SIGTERM received — shutting down gracefully')
  server.close(() => process.exit(0))
})
