/**
 * Events Domain Schema
 *
 * Event Sourcing - Immutable audit log of all state changes
 * See ADR 002 for architectural rationale
 */

import { pgTable, text, timestamp, jsonb, bigint, integer, index } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { ulid } from 'ulid'
import { companies, users, devices } from './identity'

// ============================================================================
// EVENTS (Immutable Log)
// ============================================================================

export const events = pgTable(
  'events',
  {
    // Identity
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),
    type: text('type').notNull(), // "RADIO_INSTALLED", "INSPECTION_COMPLETED", etc.
    aggregateType: text('aggregate_type').notNull(), // "Site", "Equipment", "WorkOrder"
    aggregateId: text('aggregate_id').notNull(), // Entity ID this event applies to

    // Temporal
    timestamp: bigint('timestamp', { mode: 'number' }).notNull(), // Unix milliseconds (device time)
    serverTimestamp: bigint('server_timestamp', { mode: 'number' }).notNull(), // Server received (UTC)

    // Causality (for distributed systems & conflict resolution)
    vectorClock: jsonb('vector_clock').$type<Record<string, number>>().notNull(),
    causationId: text('causation_id'), // Event that caused this event
    correlationId: text('correlation_id'), // Related event chain

    // Context
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    deviceId: text('device_id')
      .notNull()
      .references(() => devices.id),
    sessionId: text('session_id').notNull(),

    // Payload (event-specific data)
    payload: jsonb('payload').notNull().$type<Record<string, unknown>>(),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(), // Additional context

    // Versioning (for schema evolution)
    version: integer('version').notNull().default(1),

    // Audit
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    // Query patterns:
    // 1. Get all events for an entity (time-travel)
    aggregateIdx: index('events_aggregate_idx').on(table.aggregateType, table.aggregateId, table.timestamp),

    // 2. Get all events of a type
    typeIdx: index('events_type_idx').on(table.type, table.timestamp),

    // 3. Get all events by user (who did what)
    userIdx: index('events_user_idx').on(table.userId, table.timestamp),

    // 4. Get all events by company (multi-tenant isolation)
    companyIdx: index('events_company_idx').on(table.companyId, table.timestamp),

    // 5. Get related event chains (correlation)
    correlationIdx: index('events_correlation_idx').on(table.correlationId),

    // 6. Causation tracking
    causationIdx: index('events_causation_idx').on(table.causationId),

    // 7. Time-based queries
    timestampIdx: index('events_timestamp_idx').on(table.timestamp),
    serverTimestampIdx: index('events_server_timestamp_idx').on(table.serverTimestamp),

    // 8. JSONB payload search (GIN index)
    // CREATE INDEX events_payload_idx ON events USING GIN(payload jsonb_path_ops);
  })
)

export const eventsRelations = relations(events, ({ one }) => ({
  company: one(companies, {
    fields: [events.companyId],
    references: [companies.id],
  }),
  user: one(users, {
    fields: [events.userId],
    references: [users.id],
  }),
  device: one(devices, {
    fields: [events.deviceId],
    references: [devices.id],
  }),
}))

// ============================================================================
// SYNC QUEUE (Offline Sync Support)
// ============================================================================

export const syncQueue = pgTable(
  'sync_queue',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),
    deviceId: text('device_id')
      .notNull()
      .references(() => devices.id, { onDelete: 'cascade' }),
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),

    // Sync status
    status: text('status').notNull().default('PENDING'), // PENDING, SYNCING, SYNCED, FAILED
    retryCount: integer('retry_count').notNull().default(0),
    nextRetryAt: timestamp('next_retry_at', { withTimezone: true }),
    error: jsonb('error').$type<{
      message: string
      code?: string
      stack?: string
    }>(),

    // Timestamps
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    syncedAt: timestamp('synced_at', { withTimezone: true }),
  },
  (table) => ({
    deviceIdx: index('sync_queue_device_idx').on(table.deviceId),
    statusIdx: index('sync_queue_status_idx').on(table.status),
    // Pending events that need sync
    pendingIdx: index('sync_queue_pending_idx').on(table.deviceId, table.createdAt),
  })
)

export const syncQueueRelations = relations(syncQueue, ({ one }) => ({
  device: one(devices, {
    fields: [syncQueue.deviceId],
    references: [devices.id],
  }),
  event: one(events, {
    fields: [syncQueue.eventId],
    references: [events.id],
  }),
}))

// ============================================================================
// EVENT TYPE DEFINITIONS (TypeScript)
// ============================================================================

/**
 * Base event interface
 */
export interface DomainEvent {
  id: string
  type: string
  aggregateType: string
  aggregateId: string
  timestamp: number
  serverTimestamp: number
  vectorClock: Record<string, number>
  causationId?: string
  correlationId?: string
  companyId: string
  userId: string
  deviceId: string
  sessionId: string
  payload: Record<string, unknown>
  metadata?: Record<string, unknown>
  version: number
}

/**
 * Specific event types (examples)
 */

export interface RadioInstalledEvent extends DomainEvent {
  type: 'RADIO_INSTALLED'
  aggregateType: 'Equipment'
  payload: {
    siteId: string
    sectorId: string
    manufacturer: string
    model: string
    serialNumber: string
    mountHeight: number
    azimuth: number
    tilt: number
    installedBy: string
    crewId: string
    photos: string[]
  }
  metadata: {
    weather?: string
    temperature?: number
    safetyCheckCompleted: boolean
  }
}

export interface InspectionCompletedEvent extends DomainEvent {
  type: 'INSPECTION_COMPLETED'
  aggregateType: 'Site'
  payload: {
    inspectionType: 'PRELIMINARY' | 'FINAL' | 'QA'
    result: 'PASSED' | 'FAILED' | 'PASSED_WITH_NOTES'
    checklist: Record<string, 'PASS' | 'FAIL' | 'NA'>
    findings: Array<{
      item: string
      issue: string
      severity: 'CRITICAL' | 'MAJOR' | 'MINOR'
      photoId?: string
    }>
    inspectorNotes: string
    nextAction: string
  }
}

export interface PunchItemResolvedEvent extends DomainEvent {
  type: 'PUNCH_ITEM_RESOLVED'
  aggregateType: 'Site'
  causationId: string // References inspection event
  payload: {
    findingId: string
    resolution: string
    beforePhoto?: string
    afterPhoto: string
    verifiedBy: string
  }
}

export interface SiteCreatedEvent extends DomainEvent {
  type: 'SITE_CREATED'
  aggregateType: 'Site'
  payload: {
    name: string
    siteCode?: string
    carrier: string
    latitude: number
    longitude: number
    address: {
      street: string
      city: string
      state: string
      zip: string
      country: string
    }
    siteType: string
    status: string
  }
}

export interface EquipmentRemovedEvent extends DomainEvent {
  type: 'EQUIPMENT_REMOVED'
  aggregateType: 'Equipment'
  payload: {
    equipmentId: string
    reason: 'DECOMMISSION' | 'UPGRADE' | 'FAILURE' | 'REPLACEMENT'
    removedBy: string
    crewId: string
    condition: 'GOOD' | 'DAMAGED' | 'FAILED'
    dispositionCategory: 'RETURN' | 'SCRAP' | 'REUSE'
    photos: string[]
  }
}

export interface WorkOrderStatusChangedEvent extends DomainEvent {
  type: 'WORK_ORDER_STATUS_CHANGED'
  aggregateType: 'WorkOrder'
  payload: {
    workOrderId: string
    fromStatus: string
    toStatus: string
    reason?: string
    changedBy: string
  }
}

export interface TestPerformedEvent extends DomainEvent {
  type: 'TEST_PERFORMED'
  aggregateType: 'Equipment'
  payload: {
    testType: 'PIM' | 'VSWR' | 'FIBER_LOSS' | 'POWER'
    result: 'PASS' | 'FAIL' | 'WARNING'
    measurements: Record<string, number>
    testedBy: string
    testEquipment?: string
    photos: string[]
  }
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Event = typeof events.$inferSelect
export type NewEvent = typeof events.$inferInsert

export type SyncQueueItem = typeof syncQueue.$inferSelect
export type NewSyncQueueItem = typeof syncQueue.$inferInsert

// Event type union
export type KnownEvent =
  | RadioInstalledEvent
  | InspectionCompletedEvent
  | PunchItemResolvedEvent
  | SiteCreatedEvent
  | EquipmentRemovedEvent
  | WorkOrderStatusChangedEvent
  | TestPerformedEvent
