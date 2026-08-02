/**
 * Media Domain Schema
 *
 * Photos and Documents
 */

import { pgTable, text, timestamp, jsonb, pgEnum, index, bigint, integer, real, boolean } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { ulid } from 'ulid'
import { companies, users, devices } from './identity'
import { sites } from './sites'
import { equipment } from './equipment'
import { workOrders, tasks } from './work-orders'

// ============================================================================
// ENUMS
// ============================================================================

export const photoCategoryEnum = pgEnum('photo_category', [
  'SITE_OVERVIEW',
  'EQUIPMENT_INSTALLED',
  'EQUIPMENT_CLOSEUP',
  'BEFORE',
  'AFTER',
  'INSPECTION_FINDING',
  'SAFETY_ISSUE',
  'TEST_RESULT',
  'LABEL',
  'DOCUMENTATION',
  'DAMAGE',
  'OTHER',
])

export const documentTypeEnum = pgEnum('document_type', [
  'CONSTRUCTION_DRAWING',
  'RF_DESIGN',
  'STRUCTURAL_DRAWING',
  'SITE_PLAN',
  'TEST_REPORT',
  'INSPECTION_REPORT',
  'CLOSEOUT_PACKAGE',
  'MANUAL',
  'SPEC_SHEET',
  'PERMIT',
  'LEASE_AGREEMENT',
  'INSURANCE_CERTIFICATE',
  'SAFETY_PLAN',
  'OTHER',
])

// ============================================================================
// PHOTOS
// ============================================================================

export const photos = pgTable(
  'photos',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),

    // Context (nullable - photo can belong to multiple entities)
    siteId: text('site_id').references(() => sites.id, { onDelete: 'cascade' }),
    equipmentId: text('equipment_id').references(() => equipment.id, { onDelete: 'cascade' }),
    workOrderId: text('work_order_id').references(() => workOrders.id, { onDelete: 'cascade' }),
    taskId: text('task_id').references(() => tasks.id, { onDelete: 'cascade' }),

    // File storage
    filename: text('filename').notNull(),
    originalUrl: text('original_url').notNull(), // S3 URL
    thumbnailUrl: text('thumbnail_url').notNull(), // Optimized thumbnail
    fileSizeBytes: bigint('file_size_bytes', { mode: 'number' }).notNull(),
    mimeType: text('mime_type').notNull(),
    dimensions: jsonb('dimensions').$type<{
      width: number
      height: number
    }>().notNull(),

    // Metadata
    caption: text('caption'),
    category: photoCategoryEnum('category').notNull(),
    tags: jsonb('tags').$type<string[]>().default([]),

    // EXIF data
    takenAt: timestamp('taken_at', { withTimezone: true }).notNull(),
    gpsLatitude: real('gps_latitude'),
    gpsLongitude: real('gps_longitude'),
    deviceModel: text('device_model'),
    cameraSettings: jsonb('camera_settings').$type<{
      iso?: number
      aperture?: string
      shutterSpeed?: string
      focalLength?: string
      [key: string]: unknown
    }>(),

    // Upload info
    uploadedBy: text('uploaded_by')
      .notNull()
      .references(() => users.id),
    uploadedFromDevice: text('uploaded_from_device')
      .notNull()
      .references(() => devices.id),

    // Processing
    isProcessed: boolean('is_processed').notNull().default(false),
    isAnalyzed: boolean('is_analyzed').notNull().default(false),
    aiTags: jsonb('ai_tags').$type<string[]>(), // Auto-generated tags from AI

    // Audit
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyIdx: index('photos_company_idx').on(table.companyId),
    siteIdx: index('photos_site_idx').on(table.siteId),
    equipmentIdx: index('photos_equipment_idx').on(table.equipmentId),
    workOrderIdx: index('photos_work_order_idx').on(table.workOrderId),
    taskIdx: index('photos_task_idx').on(table.taskId),
    categoryIdx: index('photos_category_idx').on(table.category),
    takenAtIdx: index('photos_taken_at_idx').on(table.takenAt),
    uploadedByIdx: index('photos_uploaded_by_idx').on(table.uploadedBy),
    // Composite index for common query: site + category + date
    siteContextIdx: index('photos_site_context_idx').on(table.siteId, table.category, table.takenAt),
  })
)

export const photosRelations = relations(photos, ({ one }) => ({
  company: one(companies, {
    fields: [photos.companyId],
    references: [companies.id],
  }),
  site: one(sites, {
    fields: [photos.siteId],
    references: [sites.id],
  }),
  equipment: one(equipment, {
    fields: [photos.equipmentId],
    references: [equipment.id],
  }),
  workOrder: one(workOrders, {
    fields: [photos.workOrderId],
    references: [workOrders.id],
  }),
  task: one(tasks, {
    fields: [photos.taskId],
    references: [tasks.id],
  }),
  uploadedByUser: one(users, {
    fields: [photos.uploadedBy],
    references: [users.id],
  }),
  uploadedFromDeviceInfo: one(devices, {
    fields: [photos.uploadedFromDevice],
    references: [devices.id],
  }),
}))

// ============================================================================
// DOCUMENTS
// ============================================================================

export const documents = pgTable(
  'documents',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),

    // Context (nullable)
    siteId: text('site_id').references(() => sites.id, { onDelete: 'cascade' }),
    workOrderId: text('work_order_id').references(() => workOrders.id, { onDelete: 'cascade' }),
    projectId: text('project_id'), // References projects, not FK for simplicity

    // File
    filename: text('filename').notNull(),
    url: text('url').notNull(), // S3 URL
    fileSizeBytes: bigint('file_size_bytes', { mode: 'number' }).notNull(),
    mimeType: text('mime_type').notNull(),

    // Classification
    documentType: documentTypeEnum('document_type').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    version: text('version'), // "Rev A", "Rev B"

    // Metadata
    tags: jsonb('tags').$type<string[]>().default([]),
    isPublic: boolean('is_public').notNull().default(false), // Accessible to client?

    // Text extraction (for search)
    extractedText: text('extracted_text'), // Full-text searchable
    pageCount: integer('page_count'),

    // Upload info
    uploadedBy: text('uploaded_by')
      .notNull()
      .references(() => users.id),
    uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull().defaultNow(),

    // Audit
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyIdx: index('documents_company_idx').on(table.companyId),
    siteIdx: index('documents_site_idx').on(table.siteId),
    workOrderIdx: index('documents_work_order_idx').on(table.workOrderId),
    projectIdx: index('documents_project_idx').on(table.projectId),
    typeIdx: index('documents_type_idx').on(table.documentType),
    uploadedByIdx: index('documents_uploaded_by_idx').on(table.uploadedBy),
    // Full-text search index (PostgreSQL specific)
    // CREATE INDEX documents_text_search_idx ON documents USING GIN(to_tsvector('english', extracted_text));
  })
)

export const documentsRelations = relations(documents, ({ one }) => ({
  company: one(companies, {
    fields: [documents.companyId],
    references: [companies.id],
  }),
  site: one(sites, {
    fields: [documents.siteId],
    references: [sites.id],
  }),
  workOrder: one(workOrders, {
    fields: [documents.workOrderId],
    references: [workOrders.id],
  }),
  uploadedByUser: one(users, {
    fields: [documents.uploadedBy],
    references: [users.id],
  }),
}))

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Photo = typeof photos.$inferSelect
export type NewPhoto = typeof photos.$inferInsert

export type Document = typeof documents.$inferSelect
export type NewDocument = typeof documents.$inferInsert
