# Database Schema Quick Reference

Quick lookup for TowerOS database schema.

---

## Tables Overview

| Table | Domain | Purpose |
|-------|--------|---------|
| `companies` | Identity | Multi-tenant boundary |
| `users` | Identity | People using TowerOS |
| `teams` | Identity | Organizational groups |
| `crews` | Identity | Field crews |
| `sessions` | Identity | Authentication sessions |
| `devices` | Identity | Mobile/web clients |
| `sites` | Site | Physical cell sites (digital twin root) |
| `sectors` | Site | Antenna sectors (Alpha, Beta, Gamma) |
| `equipment` | Equipment | All physical equipment |
| `equipment_connections` | Equipment | Equipment relationship graph |
| `test_results` | Equipment | PIM, VSWR, fiber, power tests |
| `projects` | Work Order | Collection of work orders |
| `work_orders` | Work Order | Specific work assignments |
| `tasks` | Work Order | Individual tasks |
| `photos` | Media | Field photos with EXIF |
| `documents` | Media | PDFs, drawings, reports |
| `events` | Events | Immutable audit log |
| `sync_queue` | Events | Offline sync reconciliation |

---

## Common Queries

### Get Site with All Related Data

```typescript
const site = await db.query.sites.findFirst({
  where: eq(sites.id, siteId),
  with: {
    sectors: {
      with: { equipment: true }
    },
    equipment: true,
    workOrders: {
      with: { tasks: true }
    },
    photos: true,
    documents: true,
  },
})
```

### Get Active Work Orders for a Crew

```typescript
const workOrders = await db.query.workOrders.findMany({
  where: and(
    eq(workOrders.assignedToCrewId, crewId),
    eq(workOrders.status, 'IN_PROGRESS')
  ),
  with: {
    site: true,
    tasks: true,
  },
})
```

### Find Equipment Signal Path (Graph Query)

```typescript
const connections = await db.query.equipmentConnections.findMany({
  where: eq(equipmentConnections.fromEquipmentId, radioId),
  with: {
    fromEquipment: true,
    toEquipment: true,
  },
})
```

### Get Site Timeline (Event Sourcing)

```typescript
const timeline = await db
  .select()
  .from(events)
  .where(
    and(
      eq(events.aggregateId, siteId),
      eq(events.aggregateType, 'Site'),
      gte(events.timestamp, startDate),
      lte(events.timestamp, endDate)
    )
  )
  .orderBy(events.timestamp)
```

### Search Photos by Context

```typescript
const photos = await db.query.photos.findMany({
  where: and(
    eq(photos.siteId, siteId),
    eq(photos.category, 'EQUIPMENT_INSTALLED')
  ),
  orderBy: desc(photos.takenAt),
  limit: 50,
})
```

---

## Enums Reference

### User Roles
```
SUPER_ADMIN, COMPANY_ADMIN, PROJECT_MANAGER,
FOREMAN, TECHNICIAN, INSPECTOR, CLIENT
```

### Site Status
```
PLANNED, PERMITTING, CONSTRUCTION, TESTING,
INSPECTION, PUNCH_LIST, ACCEPTED, ON_AIR,
MAINTENANCE, DECOMMISSIONED
```

### Work Order Status
```
DRAFT, SCHEDULED, ASSIGNED, MOBILIZED,
IN_PROGRESS, ON_HOLD, TESTING, INSPECTION,
PUNCH_LIST, COMPLETED, ACCEPTED, CANCELLED
```

### Equipment Type
```
ANTENNA, RADIO_RRU, RADIO_BBU, RET,
HYBRID_CABLE, FIBER_CABLE, COAX_CABLE,
POWER_CABLE, RECTIFIER, BATTERY, BREAKER,
GROUNDING_KIT, MOUNT, BRACKET, CABINET,
MICROWAVE_DISH, GPS_ANTENNA, JUMPER,
SURGE_PROTECTOR
```

### Equipment Status
```
ORDERED, RECEIVED, STAGED, INSTALLED,
TESTED, IN_SERVICE, FAILED, REMOVED
```

### Task Type
```
SAFETY_BRIEFING, SITE_SURVEY, MATERIAL_STAGING,
EQUIPMENT_INSTALLATION, CABLE_ROUTING,
FIBER_TERMINATION, POWER_INSTALLATION, GROUNDING,
TESTING_PIM, TESTING_VSWR, TESTING_FIBER,
TESTING_POWER, INSPECTION, DOCUMENTATION,
PUNCH_LIST_ITEM, CLEANUP
```

### Photo Category
```
SITE_OVERVIEW, EQUIPMENT_INSTALLED,
EQUIPMENT_CLOSEUP, BEFORE, AFTER,
INSPECTION_FINDING, SAFETY_ISSUE,
TEST_RESULT, LABEL, DOCUMENTATION,
DAMAGE, OTHER
```

---

## Relationships

### Site → Equipment
```typescript
// One site has many equipment
site.equipment

// One equipment belongs to one site
equipment.site
```

### Equipment → Equipment (Graph)
```typescript
// Equipment connections (directed graph)
equipment.connectionsFrom  // Outgoing connections
equipment.connectionsTo    // Incoming connections
```

### Work Order → Tasks
```typescript
// One work order has many tasks
workOrder.tasks

// One task belongs to one work order
task.workOrder
```

### User → Actions
```typescript
// All entities track who created/updated
entity.createdBy → user
entity.updatedBy → user
```

---

## Indexes

All tables include standard indexes:
- Primary key (ULID)
- Foreign keys
- Status fields
- Common query patterns

Spatial indexes (production):
- Site locations (PostGIS GIST)

JSONB indexes:
- Equipment specifications
- Event payloads
- Site metadata

Full-text search:
- Document extracted text
- Site names/codes

---

## Multi-Tenancy

All queries automatically scoped by company:

```typescript
// Set company context (from JWT)
await db.execute(
  sql`SET app.current_company_id = ${companyId}`
)

// All subsequent queries filtered by company_id via RLS
const sites = await db.query.sites.findMany()
// Only returns sites for current company
```

---

## Event Types

Common event types:

```typescript
'SITE_CREATED'
'SITE_UPDATED'
'EQUIPMENT_INSTALLED'
'EQUIPMENT_REMOVED'
'INSPECTION_COMPLETED'
'TEST_PERFORMED'
'WORK_ORDER_STATUS_CHANGED'
'TASK_COMPLETED'
'PHOTO_UPLOADED'
'PUNCH_ITEM_RESOLVED'
```

Event structure:
```typescript
{
  id: string
  type: string
  aggregateType: 'Site' | 'Equipment' | 'WorkOrder'
  aggregateId: string
  timestamp: number
  userId: string
  payload: { ... }
  metadata: { ... }
}
```

---

## Migrations

```bash
# Generate migration after schema changes
pnpm generate

# Apply migrations
pnpm migrate

# Check migration status
pnpm check
```

---

## Type Inference

All types inferred from schema:

```typescript
import type {
  Site, NewSite,
  Equipment, NewEquipment,
  WorkOrder, NewWorkOrder,
  // ... etc
} from '@tower/database'
```

`NewX` = Insert type (some fields optional)
`X` = Select type (all fields present)

---

**For complete documentation see: [README.md](./README.md)**
