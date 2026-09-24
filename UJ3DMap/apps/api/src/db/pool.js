/**
 * apps/api/src/db/pool.js
 *
 * A single shared pg.Pool instance for the entire API.
 *
 * Why pg.Pool instead of pg.Client?
 *   - Pool maintains multiple connections — concurrent requests don't queue up
 *   - Pool automatically reconnects on disconnect
 *   - You never manage individual connection lifecycle in handlers
 *
 * All connection parameters come from environment variables.
 * See .env.example for the full list.
 */

import pg from 'pg'

const { Pool } = pg

// Create and export a single pool shared across all controllers.
// pg.Pool reads the connection config once at startup.
export const pool = new Pool({
  host:     process.env.PG_HOST     || 'localhost',
  port:     parseInt(process.env.PG_PORT || '5432', 10),
  user:     process.env.PG_USER     || 'postgres',
  password: process.env.PG_PASS     || '',
  database: process.env.PG_DB       || 'uj3dmap',

  // Connection pool sizing
  max:              10,   // Maximum simultaneous connections
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Fail fast if Postgres is unreachable
})

// Log when the pool acquires or errors on a connection
pool.on('error', (err) => {
  console.error('[db] Unexpected error on idle client:', err)
})

pool.on('connect', () => {
  console.log('[db] New connection established to PostgreSQL')
})

/**
 * Thin query wrapper — just forwards to pool.query.
 * Using this instead of pool.query() directly makes it easy to add
 * query logging or metrics in one place later.
 *
 * @param {string} text   — SQL string with $1, $2 placeholders
 * @param {Array}  params — parameter values
 * @returns {Promise<pg.QueryResult>}
 */
export function query(text, params) {
  return pool.query(text, params)
}
