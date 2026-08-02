/**
 * Migration Runner
 *
 * Applies database migrations
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/tower_dev'

  console.log('🔄 Running database migrations...')
  console.log(`📍 Database: ${connectionString.split('@')[1]}\n`)

  const sql = postgres(connectionString, { max: 1 })
  const db = drizzle(sql)

  try {
    await migrate(db, { migrationsFolder: './migrations' })
    console.log('✅ Migrations completed successfully!\n')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

runMigrations()
