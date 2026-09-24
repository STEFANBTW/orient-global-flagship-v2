/**
 * src/utils/apiClient.js
 *
 * Replaces the @supabase/supabase-js client SDK.
 *
 * A thin fetch() wrapper that:
 *   - Automatically prepends the API base URL
 *   - Attaches the JWT from localStorage on every request
 *   - Parses JSON responses
 *   - Returns { data, error } — same shape as Supabase's client — so callers
 *     need minimal changes
 *
 * Zero dependencies. Zero npm packages. Uses browser's native fetch().
 *
 * Usage:
 *   import { apiFetch } from './apiClient.js'
 *   const { data, error } = await apiFetch('/buildings?campus=main')
 *   const { data, error } = await apiFetch('/auth/login', {
 *     method: 'POST',
 *     body: { email, password }
 *   })
 */

// The API server address. In production this becomes an env var injected at build time.
// During development both the Vite dev server (:5173) and the API (:3001) run locally.
const API_BASE = window.__API_BASE__ || 'http://localhost:3001/api'

// Storage key for the JWT token
const TOKEN_KEY = 'uj3dmap_token'

// ─── Token management ─────────────────────────────────────────────────────────

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isLoggedIn() {
  return !!getToken()
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

/**
 * Makes an authenticated HTTP request to the UJ3DMap API.
 *
 * @param {string} path     — API path WITHOUT /api prefix (e.g. '/buildings')
 * @param {object} options  — optional fetch options
 * @param {string} options.method   — HTTP method (default: 'GET')
 * @param {object} options.body     — request body (auto-serialised to JSON)
 * @param {object} options.headers  — additional headers
 *
 * @returns {Promise<{ data: any|null, error: string|null }>}
 */
export async function apiFetch(path, options = {}) {
  const { method = 'GET', body, headers = {} } = options

  // Build headers — always JSON, always attach JWT if available
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  }

  const token = getToken()
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`
  }

  const fetchOptions = {
    method,
    headers: requestHeaders,
  }

  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, fetchOptions)
    const json     = await response.json()

    if (!response.ok) {
      return { data: null, error: json.error || `HTTP ${response.status}` }
    }

    return { data: json, error: null }

  } catch (err) {
    // Network error — API is unreachable
    return { data: null, error: `Network error: ${err.message}` }
  }
}

// ─── Convenience shorthands ───────────────────────────────────────────────────

export const apiGet  = (path)         => apiFetch(path)
export const apiPost = (path, body)   => apiFetch(path, { method: 'POST',  body })
export const apiPatch = (path, body)  => apiFetch(path, { method: 'PATCH', body })
export const apiDelete = (path)       => apiFetch(path, { method: 'DELETE' })
