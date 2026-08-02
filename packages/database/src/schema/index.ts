/**
 * TowerOS Database Schema
 *
 * Complete schema export for Drizzle ORM
 */

// Identity Domain
export * from './identity'

// Site Domain
export * from './sites'

// Equipment Domain
export * from './equipment'

// Work Order Domain
export * from './work-orders'

// Media Domain
export * from './media'

// Events Domain (Event Sourcing)
export * from './events'

// Authentication Domain
export * from './auth'

// Re-export all tables for migrations
import { companies, users, teams, crews, sessions, devices } from './identity'
import { sites, sectors } from './sites'
import { equipment, equipmentConnections, testResults } from './equipment'
import { projects, workOrders, tasks } from './work-orders'
import { photos, documents } from './media'
import { events, syncQueue } from './events'
import { refreshTokens, passwordResetTokens, loginAttempts, accountLockouts } from './auth'

export const schema = {
  // Identity
  companies,
  users,
  teams,
  crews,
  sessions,
  devices,

  // Sites
  sites,
  sectors,

  // Equipment
  equipment,
  equipmentConnections,
  testResults,

  // Work Orders
  projects,
  workOrders,
  tasks,

  // Media
  photos,
  documents,

  // Events
  events,
  syncQueue,

  // Auth
  refreshTokens,
  passwordResetTokens,
  loginAttempts,
  accountLockouts,
}
