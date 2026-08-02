/**
 * Equipment Domain Schema
 *
 * Equipment and Equipment Connections - the digital twin components
 */

import { pgTable, text, timestamp, jsonb, pgEnum, index, real, date, integer } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { ulid } from 'ulid'
import { companies, users } from './identity'
import { sites, sectors } from './sites'
import { workOrders } from './work-orders'

// ============================================================================
// ENUMS
// ============================================================================

export const equipmentTypeEnum = pgEnum('equipment_type', [
  'ANTENNA',
  'RADIO_RRU',
  'RADIO_BBU',
  'RET',
  'HYBRID_CABLE',
  'FIBER_CABLE',
  'COAX_CABLE',
  'POWER_CABLE',
  'RECTIFIER',
  'BATTERY',
  'BREAKER',
  'GROUNDING_KIT',
  'MOUNT',
  'BRACKET',
  'CABINET',
  'MICROWAVE_DISH',
  'GPS_ANTENNA',
  'JUMPER',
  'SURGE_PROTECTOR',
])

export const equipmentCategoryEnum = pgEnum('equipment_category', [
  'RF',
  'POWER',
  'STRUCTURAL',
  'CONNECTIVITY',
  'SAFETY',
  'BACKHAUL',
  'MONITORING',
])

export const equipmentStatusEnum = pgEnum('equipment_status', [
  'ORDERED',
  'RECEIVED',
  'STAGED',
  'INSTALLED',
  'TESTED',
  'IN_SERVICE',
  'FAILED',
  'REMOVED',
])

export const connectionTypeEnum = pgEnum('connection_type', [
  'RF_PATH',
  'FIBER',
  'POWER',
  'RET_CONTROL',
  'ETHERNET',
  'AISG',
  'ALARM',
])

export const connectionStatusEnum = pgEnum('connection_status', [
  'PLANNED',
  'INSTALLED',
  'TESTED',
  'ACTIVE',
  'DISCONNECTED',
])

// ============================================================================
// EQUIPMENT
// ============================================================================

export const equipment = pgTable(
  'equipment',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),
    siteId: text('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    sectorId: text('sector_id').references(() => sectors.id, { onDelete: 'set null' }),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),

    // Classification
    equipmentType: equipmentTypeEnum('equipment_type').notNull(),
    category: equipmentCategoryEnum('category').notNull(),

    // Manufacturer Info
    manufacturer: text('manufacturer').notNull(),
    model: text('model').notNull(),
    serialNumber: text('serial_number'),
    firmwareVersion: text('firmware_version'),

    // Physical Location
    mountLocation: text('mount_location'), // "250' AGL - Northeast leg"
    mountHeightFt: real('mount_height_ft'),
    // In production: use PostGIS point
    gpsLatitude: real('gps_latitude'),
    gpsLongitude: real('gps_longitude'),

    // Installation
    installationDate: date('installation_date'),
    installedBy: text('installed_by').references(() => users.id),
    crewId: text('crew_id'),
    workOrderId: text('work_order_id').references(() => workOrders.id),

    // Status
    status: equipmentStatusEnum('status').notNull().default('ORDERED'),
    inServiceDate: date('in_service_date'),
    removalDate: date('removal_date'),

    // Specifications (flexible JSONB for equipment-specific data)
    specifications: jsonb('specifications').$type<{
      // Radio specs
      frequencyBands?: string[]
      powerOutputWatts?: number
      channels?: number
      mimoConfiguration?: string // "4x4", "8x8"

      // Antenna specs
      frequencyRange?: string // "1710-2180 MHz"
      gainDbi?: number
      polarization?: string // "X-POL", "V-POL"
      connectorType?: string // "7/16 DIN", "4.3-10"

      // Cable specs
      fiberCount?: number
      dcConductorGauge?: string // "6 AWG"
      lengthFt?: number

      // Power specs
      voltage?: number
      amperage?: number
      capacity?: number

      // Custom fields
      [key: string]: unknown
    }>().default({}),

    // Warranty
    warrantyStart: date('warranty_start'),
    warrantyMonths: integer('warranty_months'),

    // Audit
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    createdBy: text('created_by')
      .notNull()
      .references(() => users.id),
    updatedBy: text('updated_by')
      .notNull()
      .references(() => users.id),
  },
  (table) => ({
    siteIdx: index('equipment_site_idx').on(table.siteId),
    sectorIdx: index('equipment_sector_idx').on(table.sectorId),
    companyIdx: index('equipment_company_idx').on(table.companyId),
    typeIdx: index('equipment_type_idx').on(table.equipmentType),
    categoryIdx: index('equipment_category_idx').on(table.category),
    statusIdx: index('equipment_status_idx').on(table.status),
    serialNumberIdx: index('equipment_serial_number_idx').on(table.serialNumber),
    // Composite index for common query: site + type + status
    siteTypeStatusIdx: index('equipment_site_type_status_idx').on(
      table.siteId,
      table.equipmentType,
      table.status
    ),
  })
)

export const equipmentRelations = relations(equipment, ({ one, many }) => ({
  site: one(sites, {
    fields: [equipment.siteId],
    references: [sites.id],
  }),
  sector: one(sectors, {
    fields: [equipment.sectorId],
    references: [sectors.id],
  }),
  company: one(companies, {
    fields: [equipment.companyId],
    references: [companies.id],
  }),
  installedByUser: one(users, {
    fields: [equipment.installedBy],
    references: [users.id],
    relationName: 'equipment_installer',
  }),
  createdByUser: one(users, {
    fields: [equipment.createdBy],
    references: [users.id],
    relationName: 'equipment_creator',
  }),
  workOrder: one(workOrders, {
    fields: [equipment.workOrderId],
    references: [workOrders.id],
  }),
  connectionsFrom: many(equipmentConnections, { relationName: 'from_equipment' }),
  connectionsTo: many(equipmentConnections, { relationName: 'to_equipment' }),
  photos: many(photos),
  testResults: many(testResults),
}))

// ============================================================================
// EQUIPMENT CONNECTIONS (Graph)
// ============================================================================

export const equipmentConnections = pgTable(
  'equipment_connections',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),

    // Source and destination
    fromEquipmentId: text('from_equipment_id')
      .notNull()
      .references(() => equipment.id, { onDelete: 'cascade' }),
    toEquipmentId: text('to_equipment_id')
      .notNull()
      .references(() => equipment.id, { onDelete: 'cascade' }),

    // Connection details
    connectionType: connectionTypeEnum('connection_type').notNull(),
    fromPort: text('from_port'), // "Port 1", "Output A"
    toPort: text('to_port'), // "Input 1"

    // Physical details
    cableLengthFt: real('cable_length_ft'),
    cableType: text('cable_type'),
    connectorTypes: jsonb('connector_types').$type<string[]>().default([]),

    // Testing
    testedAt: timestamp('tested_at', { withTimezone: true }),
    testResults: jsonb('test_results').$type<Record<string, unknown>>(),

    // Status
    status: connectionStatusEnum('status').notNull().default('PLANNED'),

    // Audit
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    fromIdx: index('equipment_connections_from_idx').on(table.fromEquipmentId),
    toIdx: index('equipment_connections_to_idx').on(table.toEquipmentId),
    companyIdx: index('equipment_connections_company_idx').on(table.companyId),
    typeIdx: index('equipment_connections_type_idx').on(table.connectionType),
    statusIdx: index('equipment_connections_status_idx').on(table.status),
  })
)

export const equipmentConnectionsRelations = relations(equipmentConnections, ({ one }) => ({
  company: one(companies, {
    fields: [equipmentConnections.companyId],
    references: [companies.id],
  }),
  fromEquipment: one(equipment, {
    fields: [equipmentConnections.fromEquipmentId],
    references: [equipment.id],
    relationName: 'from_equipment',
  }),
  toEquipment: one(equipment, {
    fields: [equipmentConnections.toEquipmentId],
    references: [equipment.id],
    relationName: 'to_equipment',
  }),
}))

// ============================================================================
// TEST RESULTS
// ============================================================================

export const testResults = pgTable(
  'test_results',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    equipmentId: text('equipment_id')
      .notNull()
      .references(() => equipment.id, { onDelete: 'cascade' }),
    siteId: text('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    workOrderId: text('work_order_id').references(() => workOrders.id),
    taskId: text('task_id'), // Will reference tasks table

    // Test details
    testType: text('test_type').notNull(), // "PIM", "VSWR", "FIBER_LOSS", "POWER"
    result: text('result').notNull(), // "PASS", "FAIL", "WARNING"
    passed: integer('passed').notNull(), // 1 = passed, 0 = failed (for easy filtering)

    // Measurements (flexible JSONB)
    measurements: jsonb('measurements').$type<{
      // PIM test
      pimLevel?: number // dBm
      frequency?: number // MHz

      // VSWR test
      vswr?: number
      returnLoss?: number // dB

      // Fiber test
      loss?: number // dB
      length?: number // meters
      reflectance?: number

      // Power test
      voltage?: number
      current?: number
      resistance?: number

      [key: string]: unknown
    }>().default({}),

    // Test metadata
    testedBy: text('tested_by')
      .notNull()
      .references(() => users.id),
    testedAt: timestamp('tested_at', { withTimezone: true }).notNull().defaultNow(),
    metadata: jsonb('metadata').$type<{
      temperature?: number
      humidity?: number
      weather?: string
      testEquipment?: string
      notes?: string
      [key: string]: unknown
    }>().default({}),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    equipmentIdx: index('test_results_equipment_idx').on(table.equipmentId),
    siteIdx: index('test_results_site_idx').on(table.siteId),
    companyIdx: index('test_results_company_idx').on(table.companyId),
    typeIdx: index('test_results_type_idx').on(table.testType),
    resultIdx: index('test_results_result_idx').on(table.result),
    testedByIdx: index('test_results_tested_by_idx').on(table.testedBy),
  })
)

export const testResultsRelations = relations(testResults, ({ one }) => ({
  company: one(companies, {
    fields: [testResults.companyId],
    references: [companies.id],
  }),
  equipment: one(equipment, {
    fields: [testResults.equipmentId],
    references: [equipment.id],
  }),
  site: one(sites, {
    fields: [testResults.siteId],
    references: [sites.id],
  }),
  workOrder: one(workOrders, {
    fields: [testResults.workOrderId],
    references: [workOrders.id],
  }),
  testedByUser: one(users, {
    fields: [testResults.testedBy],
    references: [users.id],
  }),
}))

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Equipment = typeof equipment.$inferSelect
export type NewEquipment = typeof equipment.$inferInsert

export type EquipmentConnection = typeof equipmentConnections.$inferSelect
export type NewEquipmentConnection = typeof equipmentConnections.$inferInsert

export type TestResult = typeof testResults.$inferSelect
export type NewTestResult = typeof testResults.$inferInsert

// Import types
import { photos } from './media'
