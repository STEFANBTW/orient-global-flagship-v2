/**
 * apps/api/src/controllers/authController.js
 *
 * Handles user authentication using:
 *   - Node's built-in crypto.scryptSync for password verification (zero npm cost)
 *   - jsonwebtoken for signing the JWT returned to the client
 *
 * Why scrypt instead of bcrypt?
 *   scrypt is built into Node.js crypto — it is memory-hard, secure, and
 *   requires no extra npm package. bcrypt would require an npm install.
 *   This is consistent with the PRD v3 rule: only install npm packages
 *   for things you genuinely cannot do with what Node ships natively.
 */

import { createHash, scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'
import jwt   from 'jsonwebtoken'
import { query } from '../db/pool.js'

// ─── Constants ───────────────────────────────────────────────────────────────
const SALT_LENGTH   = 16   // bytes of random salt per password
const KEY_LENGTH    = 64   // bytes in the derived key
const SEPARATOR     = ':'  // salt:hash format in the database

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Hashes a plaintext password using scrypt.
 * Returns a string in the format:  "hexSalt:hexHash"
 * Store this entire string in the database.
 *
 * @param {string} plaintext
 * @returns {string}
 */
export function hashPassword(plaintext) {
  const salt   = randomBytes(SALT_LENGTH).toString('hex')
  const hash   = scryptSync(plaintext, salt, KEY_LENGTH).toString('hex')
  return `${salt}${SEPARATOR}${hash}`
}

/**
 * Verifies a plaintext password against a stored hash string.
 * Uses timingSafeEqual to prevent timing-based attacks.
 *
 * @param {string} plaintext
 * @param {string} stored — the "hexSalt:hexHash" string from the database
 * @returns {boolean}
 */
function verifyPassword(plaintext, stored) {
  const [salt, storedHash] = stored.split(SEPARATOR)
  if (!salt || !storedHash) return false

  const derivedHash = scryptSync(plaintext, salt, KEY_LENGTH)
  const storedBuf   = Buffer.from(storedHash, 'hex')

  // timingSafeEqual prevents an attacker from guessing the hash
  // character-by-character based on response timing
  if (derivedHash.length !== storedBuf.length) return false
  return timingSafeEqual(derivedHash, storedBuf)
}

// ─── Route Handler ────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 * Body: { email: string, password: string }
 *
 * Returns: { token: string }
 *
 * The token is a signed JWT containing { id, email, role }.
 * The client stores it in localStorage and sends it as:
 *   Authorization: Bearer <token>
 */
export async function login(req, res) {
  const { email, password } = req.body || {}

  if (!email || !password) {
    return res.error('email and password are required', 400)
  }

  try {
    const result = await query(
      'SELECT id, email, password_hash, role FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    )

    const user = result.rows[0]

    // Use a constant-time response even for "user not found" to prevent
    // user enumeration via timing differences.
    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.error('Invalid email or password', 401)
    }

    // Sign JWT — payload contains only what frontend needs
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    )

    res.json({ token, role: user.role })

  } catch (err) {
    console.error('[authController] login error:', err)
    res.error('Authentication service unavailable', 500)
  }
}

/**
 * GET /api/auth/me  (protected)
 * Returns the currently authenticated user's info.
 * checkAuth middleware must have already run and set req.user.
 */
export async function me(req, res) {
  // req.user is set by checkAuth in middleware.js
  res.json({ id: req.user.id, email: req.user.email, role: req.user.role })
}
