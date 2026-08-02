/**
 * Work Order Domain Schema
 *
 * Projects, Work Orders, and Tasks
 */

import { pgTable, text, timestamp, jsonb, pgEnum, index, integer, real, date } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { ulid } from 'ulid'
import { companies, users, crews } from './identity'
import { sites } from './sites'
import { equipment } from './equipment'

// ============================================================================
// ENUMS
// ============================================================================

export const projectStatusEnum = pgEnum('project_status', [
  'PLANNING',
  'ACTIVE',
  'ON_HOLD',
  'COMPLETED',
  'CANCELLED',
])

export const workTypeEnum = pgEnum('work_type', [
  'NEW_BUILD',
  'MODERNIZATION',
  'DECOMMISSION',
  'MAINTENANCE',
  'REPAIR',
  'INSPECTION',
  'TESTING',
  'EMERGENCY',
])

export const workOrderStatusEnum = pgEnum('work_order_status', [
  'DRAFT',
  'SCHEDULED',
  'ASSIGNED',
  'MOBILIZED',
  'IN_PROGRESS',
  'ON_HOLD',
  'TESTING',
  'INSPECTION',
  'PUNCH_LIST',
  'COMPLETED',
  'ACCEPTED',
  'CANCELLED',
])

export const priorityEnum = pgEnum('priority', ['LOW', 'NORMAL', 'HIGH', 'URGENT'])

export const taskTypeEnum = pgEnum('task_type', [
  'SAFETY_BRIEFING',
  'SITE_SURVEY',
  'MATERIAL_STAGING',
  'EQUIPMENT_INSTALLATION',
  'CABLE_ROUTING',
  'FIBER_TERMINATION',
  'POWER_INSTALLATION',
  'GROUNDING',
  'TESTING_PIM',
  'TESTING_VSWR',
  'TESTING_FIBER',
  'TESTING_POWER',
  'INSPECTION',
  'DOCUMENTATION',
  'PUNCH_LIST_ITEM',
  'CLEANUP',
])

export const taskStatusEnum = pgEnum('task_status', [
  'PENDING',
  'IN_PROGRESS',
  'BLOCKED',
  'COMPLETED',
  'SKIPPED',
])

// ============================================================================
// PROJECTS
// ============================================================================

export const projects = pgTable(
  'projects',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),

    // Details
    name: text('name').notNull(),
    description: text('description'),
    client: text('client').notNull(), // Carrier name

    // Dates
    startDate: date('start_date').notNull(),
    endDate: date('end_date'),

    // Financials
    budget: real('budget'),

    // Status
    status: projectStatusEnum('status').notNull().default('PLANNING'),

    // Management
    projectManagerId: text('project_manager_id')
      .notNull()
      .references(() => users.id),

    // Audit
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    companyIdx: index('projects_company_idx').on(table.companyId),
    statusIdx: index('projects_status_idx').on(table.status),
    pmIdx: index('projects_pm_idx').on(table.projectManagerId),
  })
)

export const projectsRelations = relations(projects, ({ one, many }) => ({
  company: one(companies, {
    fields: [projects.companyId],
    references: [companies.id],
  }),
  projectManager: one(users, {
    fields: [projects.projectManagerId],
    references: [users.id],
  }),
  workOrders: many(workOrders),
}))

// ============================================================================
// WORK ORDERS
// ============================================================================

export const workOrders = pgTable(
  'work_orders',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    projectId: text('project_id').references(() => projects.id, { onDelete: 'set null' }),
    siteId: text('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),

    // Identification
    workOrderNumber: text('work_order_number').notNull().unique(),
    title: text('title').notNull(),
    description: text('description'),
    workType: workTypeEnum('work_type').notNull(),

    // Scheduling
    scheduledStart: timestamp('scheduled_start', { withTimezone: true }).notNull(),
    scheduledEnd: timestamp('scheduled_end', { withTimezone: true }).notNull(),
    actualStart: timestamp('actual_start', { withTimezone: true }),
    actualEnd: timestamp('actual_end', { withTimezone: true }),

    // Assignment
    assignedToCrewId: text('assigned_to_crew_id').references(() => crews.id, { onDelete: 'set null' }),
    assignedToUserId: text('assigned_to_user_id').references(() => users.id, { onDelete: 'set null' }),
    assignedBy: text('assigned_by')
      .notNull()
      .references(() => users.id),

    // Status
    status: workOrderStatusEnum('status').notNull().default('DRAFT'),
    priority: priorityEnum('priority').notNull().default('NORMAL'),

    // Progress
    progressPercentage: integer('progress_percentage').notNull().default(0),
    tasksCompleted: integer('tasks_completed').notNull().default(0),
    tasksTotal: integer('tasks_total').notNull().default(0),

    // Financials
    estimatedCost: real('estimated_cost'),
    actualCost: real('actual_cost'),
    laborHoursEstimated: real('labor_hours_estimated'),
    laborHoursActual: real('labor_hours_actual'),

    // Carrier
    carrierPo: text('carrier_po'), // Purchase order
    carrierContact: text('carrier_contact'),

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
    companyIdx: index('work_orders_company_idx').on(table.companyId),
    projectIdx: index('work_orders_project_idx').on(table.projectId),
    siteIdx: index('work_orders_site_idx').on(table.siteId),
    statusIdx: index('work_orders_status_idx').on(table.status),
    crewIdx: index('work_orders_crew_idx').on(table.assignedToCrewId),
    userIdx: index('work_orders_user_idx').on(table.assignedToUserId),
    // Composite index for common query
    companyStatusIdx: index('work_orders_company_status_idx').on(table.companyId, table.status),
  })
)

export const workOrdersRelations = relations(workOrders, ({ one, many }) => ({
  company: one(companies, {
    fields: [workOrders.companyId],
    references: [companies.id],
  }),
  project: one(projects, {
    fields: [workOrders.projectId],
    references: [projects.id],
  }),
  site: one(sites, {
    fields: [workOrders.siteId],
    references: [sites.id],
  }),
  assignedToCrew: one(crews, {
    fields: [workOrders.assignedToCrewId],
    references: [crews.id],
  }),
  assignedToUser: one(users, {
    fields: [workOrders.assignedToUserId],
    references: [users.id],
    relationName: 'work_order_assignee',
  }),
  assignedByUser: one(users, {
    fields: [workOrders.assignedBy],
    references: [users.id],
    relationName: 'work_order_assigner',
  }),
  tasks: many(tasks),
  photos: many(photos),
  documents: many(documents),
  equipment: many(equipment),
}))

// ============================================================================
// TASKS
// ============================================================================

export const tasks = pgTable(
  'tasks',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),
    workOrderId: text('work_order_id')
      .notNull()
      .references(() => workOrders.id, { onDelete: 'cascade' }),
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),

    // Details
    title: text('title').notNull(),
    description: text('description'),
    taskType: taskTypeEnum('task_type').notNull(),
    sequenceNumber: integer('sequence_number').notNull(),

    // Assignment
    assignedTo: text('assigned_to')
      .notNull()
      .references(() => users.id),
    assignedBy: text('assigned_by')
      .notNull()
      .references(() => users.id),

    // Equipment reference
    equipmentId: text('equipment_id').references(() => equipment.id, { onDelete: 'set null' }),

    // Status
    status: taskStatusEnum('status').notNull().default('PENDING'),
    blockedReason: text('blocked_reason'),

    // Time tracking
    estimatedMinutes: integer('estimated_minutes'),
    actualStart: timestamp('actual_start', { withTimezone: true }),
    actualEnd: timestamp('actual_end', { withTimezone: true }),
    actualMinutes: integer('actual_minutes'),

    // Checklist
    checklistItems: jsonb('checklist_items').$type<Array<{
      id: string
      label: string
      completed: boolean
      completedBy?: string
      completedAt?: string
      notes?: string
    }>>().default([]),

    // Results
    result: jsonb('result').$type<{
      testType?: string
      passed: boolean
      measurements?: Record<string, unknown>
      notes?: string
      attachments?: string[] // Photo/document IDs
    }>(),

    // Audit
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    completedBy: text('completed_by').references(() => users.id),
  },
  (table) => ({
    workOrderIdx: index('tasks_work_order_idx').on(table.workOrderId),
    companyIdx: index('tasks_company_idx').on(table.companyId),
    statusIdx: index('tasks_status_idx').on(table.status),
    assignedToIdx: index('tasks_assigned_to_idx').on(table.assignedTo),
    equipmentIdx: index('tasks_equipment_idx').on(table.equipmentId),
  })
)

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  workOrder: one(workOrders, {
    fields: [tasks.workOrderId],
    references: [workOrders.id],
  }),
  company: one(companies, {
    fields: [tasks.companyId],
    references: [companies.id],
  }),
  assignedToUser: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id],
    relationName: 'task_assignee',
  }),
  assignedByUser: one(users, {
    fields: [tasks.assignedBy],
    references: [users.id],
    relationName: 'task_assigner',
  }),
  completedByUser: one(users, {
    fields: [tasks.completedBy],
    references: [users.id],
    relationName: 'task_completer',
  }),
  equipment: one(equipment, {
    fields: [tasks.equipmentId],
    references: [equipment.id],
  }),
  photos: many(photos),
}))

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert

export type WorkOrder = typeof workOrders.$inferSelect
export type NewWorkOrder = typeof workOrders.$inferInsert

export type Task = typeof tasks.$inferSelect
export type NewTask = typeof tasks.$inferInsert

// Import types
import { photos, documents } from './media'
