import pkg from 'pg'
import dotenv from 'dotenv'
const { Pool } = pkg

dotenv.config()

let pool

if (process.env.DATABASE_URL) {
  // Production - Render
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  })
  console.log('Using Render PostgreSQL database')
} else {
  // Local
  pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
  })
  console.log('Using local PostgreSQL database')
}

pool.on('connect', () => {
  console.log('Connected to the database')
})

export default pool
