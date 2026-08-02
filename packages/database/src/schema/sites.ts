/**
 * Site Domain Schema
 *
 * Sites and Sectors - the root of the digital twin
 */

import { pgTable, text, timestamp, jsonb, pgEnum, index, real, date } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { ulid } from 'ulid'
import { companies, users } from './identity'

// ============================================================================
// ENUMS
// ============================================================================

export const carrierEnum = pgEnum('carrier', [
  'ATT',
  'VERIZON',
  'TMOBILE',
  'DISH',
  'US_CELLULAR',
  'OTHER',
])

export const siteTypeEnum = pgEnum('site_type', [
  'MONOPOLE',
  'LATTICE_TOWER',
  'GUYED_TOWER',
  'ROOFTOP',
  'WATER_TANK',
  'SMALL_CELL',
  'DAS',
])

export const siteStatusEnum = pgEnum('site_status', [
  'PLANNED',
  'PERMITTING',
  'CONSTRUCTION',
  'TESTING',
  'INSPECTION',
  'PUNCH_LIST',
  'ACCEPTED',
  'ON_AIR',
  'MAINTENANCE',
  'DECOMMISSIONED',
])

export const sectorStatusEnum = pgEnum('sector_status', [
  'PLANNED',
  'INSTALLED',
  'TESTED',
  'ON_AIR',
  'DECOMMISSIONED',
])

export const bandEnum = pgEnum('band', [
  'B2_1900',
  'B4_AWS',
  'B5_850',
  'B12_700',
  'B13_700',
  'B14_700',
  'B25_1900',
  'B26_850',
  'B66_AWS',
  'B71_600',
  'N2_1900',
  'N41_2500',
  'N77_3700',
  'N78_3500',
  'N261_28GHZ',
])

// ============================================================================
// SITES
// ============================================================================

export const sites = pgTable(
  'sites',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),

    // Identification
    name: text('name').notNull(),
    siteCode: text('site_code'), // Carrier's identifier
    faNumber: text('fa_number'), // FCC registration number
    carrier: carrierEnum('carrier').notNull(),

    // Location
    // Note: In production, use PostGIS geometry type via custom extension
    // For now, storing lat/lng as separate fields
    latitude: real('latitude').notNull(),
    longitude: real('longitude').notNull(),
    address: jsonb('address').$type<{
      street: string
      city: string
      state: string
      zip: string
      country: string
    }>().notNull(),
    elevationFt: real('elevation_ft'),

    // Physical characteristics
    siteType: siteTypeEnum('site_type').notNull(),
    towerHeightFt: real('tower_height_ft'),
    structureOwner: text('structure_owner'),

    // Status
    status: siteStatusEnum('status').notNull().default('PLANNED'),
    constructionStart: date('construction_start'),
    onAirDate: date('on_air_date'),

    // Metadata (flexible for carrier-specific fields)
    metadata: jsonb('metadata').$type<{
      carrierSiteId?: string
      market?: string
      region?: string
      siteClassification?: string
      accessHours?: string
      accessRequirements?: string[]
      emergencyContacts?: Array<{
        name: string
        role: string
        phone: string
        email?: string
      }>
      [key: string]: unknown
    }>().default({}),

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
    companyIdx: index('sites_company_idx').on(table.companyId),
    statusIdx: index('sites_status_idx').on(table.status),
    carrierIdx: index('sites_carrier_idx').on(table.carrier),
    // In production: CREATE INDEX sites_location_idx ON sites USING GIST(location);
    locationIdx: index('sites_location_idx').on(table.latitude, table.longitude),
    createdByIdx: index('sites_created_by_idx').on(table.createdBy),
  })
)

export const sitesRelations = relations(sites, ({ one, many }) => ({
  company: one(companies, {
    fields: [sites.companyId],
    references: [companies.id],
  }),
  createdByUser: one(users, {
    fields: [sites.createdBy],
    references: [users.id],
    relationName: 'site_creator',
  }),
  updatedByUser: one(users, {
    fields: [sites.updatedBy],
    references: [users.id],
    relationName: 'site_updater',
  }),
  sectors: many(sectors),
  equipment: many(equipment),
  workOrders: many(workOrders),
  photos: many(photos),
  documents: many(documents),
}))

// ============================================================================
// SECTORS
// ============================================================================

export const sectors = pgTable(
  'sectors',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),
    siteId: text('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),

    // Identification
    name: text('name').notNull(), // "Alpha", "Beta", "Gamma"
    sectorNumber: real('sector_number').notNull(), // 1, 2, 3, 4

    // RF Configuration
    azimuth: real('azimuth').notNull(), // 0-360 degrees
    beamwidth: real('beamwidth').notNull(), // Antenna beamwidth
    mechanicalTilt: real('mechanical_tilt').default(0), // Physical tilt
    electricalTilt: real('electrical_tilt').default(0), // RET tilt

    // Physical
    mountHeightFt: real('mount_height_ft').notNull(),
    mountType: text('mount_type'), // "PIPE_MOUNT", "ANGLE_BRACKET"

    // Bands (array of band enums as strings)
    bands: jsonb('bands').$type<string[]>().notNull().default([]),

    // Status
    status: sectorStatusEnum('status').notNull().default('PLANNED'),

    // Audit
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    siteIdx: index('sectors_site_idx').on(table.siteId),
    companyIdx: index('sectors_company_idx').on(table.companyId),
    statusIdx: index('sectors_status_idx').on(table.status),
  })
)

export const sectorsRelations = relations(sectors, ({ one, many }) => ({
  site: one(sites, {
    fields: [sectors.siteId],
    references: [sites.id],
  }),
  company: one(companies, {
    fields: [sectors.companyId],
    references: [companies.id],
  }),
  equipment: many(equipment),
}))

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Site = typeof sites.$inferSelect
export type NewSite = typeof sites.$inferInsert

export type Sector = typeof sectors.$inferSelect
export type NewSector = typeof sectors.$inferInsert

// Import types that will be defined in other schemas
import { equipment } from './equipment'
import { workOrders } from './work-orders'
import { photos, documents } from './media'
