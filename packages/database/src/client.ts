/**
 * Database Client
 *
 * Drizzle ORM client with PostgreSQL connection
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Connection string from environment
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/tower_dev'

// Create PostgreSQL client
// For production, use connection pooling (e.g., PgBouncer)
export const sql = postgres(connectionString, {
  max: 10, // Max connections
  idle_timeout: 20,
  connect_timeout: 10,
})

// Create Drizzle instance
export const db = drizzle(sql, {
  schema,
  logger: process.env.NODE_ENV === 'development',
})

// Type-safe database instance
export type Database = typeof db

// For graceful shutdown
export async function closeDatabase() {
  await sql.end()
}
