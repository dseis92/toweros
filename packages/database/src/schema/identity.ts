/**
 * Identity Domain Schema
 *
 * Companies, Users, Teams, Crews, Sessions, Devices
 * Multi-tenant isolation boundary
 */

import { pgTable, text, timestamp, jsonb, pgEnum, index, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { ulid } from 'ulid'

// ============================================================================
// ENUMS
// ============================================================================

export const companyTypeEnum = pgEnum('company_type', ['CONTRACTOR', 'CARRIER', 'OWNER'])
export const subscriptionTierEnum = pgEnum('subscription_tier', ['BASIC', 'PRO', 'ENTERPRISE'])
export const userStatusEnum = pgEnum('user_status', ['ACTIVE', 'INACTIVE', 'SUSPENDED'])
export const userRoleEnum = pgEnum('user_role', [
  'SUPER_ADMIN',
  'COMPANY_ADMIN',
  'PROJECT_MANAGER',
  'FOREMAN',
  'TECHNICIAN',
  'INSPECTOR',
  'CLIENT',
])
export const crewStatusEnum = pgEnum('crew_status', ['AVAILABLE', 'ASSIGNED', 'OFFLINE'])

// ============================================================================
// COMPANIES
// ============================================================================

export const companies = pgTable(
  'companies',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),
    name: text('name').notNull(),
    type: companyTypeEnum('type').notNull(),
    logoUrl: text('logo_url'),
    settings: jsonb('settings').$type<{
      timezone: string
      dateFormat: string
      units: 'IMPERIAL' | 'METRIC'
      defaultCurrency: string
      safetyProtocols?: Record<string, unknown>
    }>().notNull().default({
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      units: 'IMPERIAL',
      defaultCurrency: 'USD',
    }),
    subscriptionTier: subscriptionTierEnum('subscription_tier').notNull().default('BASIC'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    nameIdx: uniqueIndex('companies_name_idx').on(table.name),
  })
)

export const companiesRelations = relations(companies, ({ many }) => ({
  users: many(users),
  sites: many(sites),
  teams: many(teams),
  crews: many(crews),
}))

// ============================================================================
// USERS
// ============================================================================

export const users = pgTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    email: text('email').notNull(),
    phone: text('phone'),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    role: userRoleEnum('role').notNull().default('TECHNICIAN'),
    avatarUrl: text('avatar_url'),

    // Password authentication (hashed with Argon2)
    passwordHash: text('password_hash'),

    // Certifications (OSHA, tower climbing, RF safety, etc.)
    certifications: jsonb('certifications').$type<Array<{
      type: string
      issuer: string
      issuedDate: string
      expiryDate?: string
      certificateUrl?: string
    }>>().default([]),

    status: userStatusEnum('status').notNull().default('ACTIVE'),
    lastActiveAt: timestamp('last_active_at', { withTimezone: true }),

    // Email verification
    emailVerified: timestamp('email_verified', { withTimezone: true }),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex('users_email_idx').on(table.email),
    companyIdx: index('users_company_idx').on(table.companyId),
    roleIdx: index('users_role_idx').on(table.role),
    statusIdx: index('users_status_idx').on(table.status),
  })
)

export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.id],
  }),
  sessions: many(sessions),
  devices: many(devices),
  ledTeams: many(teams),
  ledCrews: many(crews),
}))

// ============================================================================
// TEAMS
// ============================================================================

export const teams = pgTable(
  'teams',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    managerId: text('manager_id')
      .notNull()
      .references(() => users.id),

    // Array of user IDs
    members: jsonb('members').$type<string[]>().notNull().default([]),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyIdx: index('teams_company_idx').on(table.companyId),
    managerIdx: index('teams_manager_idx').on(table.managerId),
  })
)

export const teamsRelations = relations(teams, ({ one }) => ({
  company: one(companies, {
    fields: [teams.companyId],
    references: [companies.id],
  }),
  manager: one(users, {
    fields: [teams.managerId],
    references: [users.id],
  }),
}))

// ============================================================================
// CREWS
// ============================================================================

export const crews = pgTable(
  'crews',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    crewLeadId: text('crew_lead_id')
      .notNull()
      .references(() => users.id),

    // Array of technician user IDs
    members: jsonb('members').$type<string[]>().notNull().default([]),

    // Specializations: ["TOWER", "FIBER", "POWER", "RF"]
    specialization: jsonb('specialization').$type<string[]>().notNull().default([]),

    status: crewStatusEnum('status').notNull().default('AVAILABLE'),
    currentSiteId: text('current_site_id'),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyIdx: index('crews_company_idx').on(table.companyId),
    crewLeadIdx: index('crews_crew_lead_idx').on(table.crewLeadId),
    statusIdx: index('crews_status_idx').on(table.status),
  })
)

export const crewsRelations = relations(crews, ({ one }) => ({
  company: one(companies, {
    fields: [crews.companyId],
    references: [companies.id],
  }),
  crewLead: one(users, {
    fields: [crews.crewLeadId],
    references: [users.id],
  }),
}))

// ============================================================================
// SESSIONS (Authentication)
// ============================================================================

export const sessions = pgTable(
  'sessions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    deviceId: text('device_id').notNull(),

    // Refresh token (hashed)
    refreshToken: text('refresh_token').notNull(),

    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index('sessions_user_idx').on(table.userId),
    deviceIdx: index('sessions_device_idx').on(table.deviceId),
    expiresIdx: index('sessions_expires_idx').on(table.expiresAt),
  })
)

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

// ============================================================================
// DEVICES (Mobile/Web clients)
// ============================================================================

export const devices = pgTable(
  'devices',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    deviceName: text('device_name').notNull(),
    platform: text('platform').notNull(), // "ios", "android", "web"
    appVersion: text('app_version').notNull(),

    // Sync metadata
    lastSyncAt: timestamp('last_sync_at', { withTimezone: true }),

    // Push notifications
    pushToken: text('push_token'),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index('devices_user_idx').on(table.userId),
    platformIdx: index('devices_platform_idx').on(table.platform),
  })
)

export const devicesRelations = relations(devices, ({ one }) => ({
  user: one(users, {
    fields: [devices.userId],
    references: [users.id],
  }),
}))

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Company = typeof companies.$inferSelect
export type NewCompany = typeof companies.$inferInsert

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Team = typeof teams.$inferSelect
export type NewTeam = typeof teams.$inferInsert

export type Crew = typeof crews.$inferSelect
export type NewCrew = typeof crews.$inferInsert

export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert

export type Device = typeof devices.$inferSelect
export type NewDevice = typeof devices.$inferInsert

// Import sites for crew relation (will be defined in sites schema)
import { sites } from './sites'
