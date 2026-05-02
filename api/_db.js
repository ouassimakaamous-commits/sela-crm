import pkg from 'pg'
const { Pool } = pkg

// Underscore prefix = not a Vercel route, just a shared helper
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
})

export default pool
