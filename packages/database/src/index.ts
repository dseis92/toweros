/**
 * TowerOS Database Package
 *
 * Main entry point
 */

// Export database client
export { db, sql, closeDatabase } from './client'
export type { Database } from './client'

// Export all schema definitions and types
export * from './schema'

// Export schema object for migrations and tools
export { schema } from './schema'
