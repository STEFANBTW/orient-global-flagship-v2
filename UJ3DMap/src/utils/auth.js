/**
 * src/utils/auth.js
 *
 * Authentication helpers for the frontend.
 * Replaces Supabase SDK auth calls with direct API fetches.
 *
 * Uses apiClient.js (our zero-dependency fetch wrapper) instead of
 * @supabase/supabase-js.
 */

import { apiFetch, setToken, clearToken, getToken, isLoggedIn } from './apiClient.js'

/**
 * Signs in a user with email and password.
 * On success, stores the JWT in localStorage via apiClient.setToken().
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: object|null, error: string|null }>}
 */
export async function signIn(email, password) {
  const { data, error } = await apiFetch('/auth/login', {
    method: 'POST',
    body: { email, password },
  })

  if (error) return { user: null, error }

  // Store the JWT so every future apiFetch() call is authenticated
  setToken(data.token)

  return { user: { email, role: data.role }, error: null }
}

/**
 * Signs out the current user.
 * Clears the JWT from localStorage — no server round-trip needed.
 * (Stateless JWT means the server has nothing to revoke on logout.)
 *
 * @returns {Promise<{ error: null }>}
 */
export async function signOut() {
  clearToken()
  return { error: null }
}

/**
 * Returns the current session state by decoding the stored JWT locally.
 * No network request — the JWT carries the user info in its payload.
 *
 * @returns {Promise<{ user: object|null, role: string, error: null }>}
 */
export async function getCurrentSession() {
  const token = getToken()

  if (!token) {
    return { user: null, role: 'guest', error: null }
  }

  try {
    // Decode the JWT payload without verifying (signature verification
    // happens server-side). We just need the claims for UI decisions.
    const [, payloadBase64] = token.split('.')
    const payload = JSON.parse(atob(payloadBase64))

    // Check expiry
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      clearToken()
      return { user: null, role: 'guest', error: 'Session expired' }
    }

    return {
      user:  { id: payload.id, email: payload.email },
      role:  payload.role || 'guest',
      error: null,
    }

  } catch {
    // Malformed token
    clearToken()
    return { user: null, role: 'guest', error: 'Invalid session' }
  }
}

// Re-export the raw helpers so callers don't need to import from two places
export { isLoggedIn }
