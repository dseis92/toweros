# TowerOS Database Design

**Version:** 1.0
**Last Updated:** 2026-08-02

---

## Overview

The TowerOS database models the complete digital twin of telecommunications infrastructure. This is not a simple CRUD database—it's a spatial, temporal, and relational model of physical assets.

### Core Principles

1. **Everything is traceable** - Who, what, when, where, why
2. **Relationships matter** - Equipment doesn't exist in isolation
3. **History is immutable** - Event sourcing for all changes
4. **Multi-tenancy** - Complete data isolation between companies
5. **Spatial awareness** - Geographic queries for tower locations
6. **Performance** - Optimized for field technician workflows

---

## Entity Relationship Diagram

### Core Domains

```
┌─────────────────────────────────────────────────────────────────┐
│                         IDENTITY DOMAIN                          │
├─────────────────────────────────────────────────────────────────┤
│  Companies → Users → Teams → Crews                               │
│                ↓                                                  │
│           Sessions, Devices, Permissions                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓ owns
┌─────────────────────────────────────────────────────────────────┐
│                          SITE DOMAIN                             │
├─────────────────────────────────────────────────────────────────┤
│  Site (Digital Twin Root)                                        │
│    ├─ Location (lat/lng, address)                               │
│    ├─ Carrier Information                                        │
│    ├─ Site Metadata                                              │
│    └─ Site Status                                                │
│                                                                   │
│  Site → Tower Structure                                          │
│       → Equipment Shelter                                        │
│       → Power System                                             │
│       → Grounding System                                         │
│       → Sectors                                                   │
│                                                                   │
│  Sector (Physical grouping)                                      │
│    ├─ Azimuth, Tilt                                             │
│    └─ Antenna + Radio + Fiber + Power chain                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓ contains
┌─────────────────────────────────────────────────────────────────┐
│                        EQUIPMENT DOMAIN                          │
├─────────────────────────────────────────────────────────────────┤
│  Equipment (Base Entity)                                         │
│    ├─ Antennas                                                   │
│    ├─ Radios (RRU, BBU, RRH)                                    │
│    ├─ Cables (Fiber, Hybrid, Coax)                              │
│    ├─ Power Equipment (Rectifiers, Batteries, Breakers)         │
│    ├─ RETs (Remote Electrical Tilt)                             │
│    └─ Accessories (Mounts, Brackets, Grounding Kits)            │
│                                                                   │
│  Equipment Relationships (Graph)                                 │
│    - Radio → powered by → Breaker                                │
│    - Radio → fed by → Fiber Port                                 │
│    - Radio → connected to → Antenna via Hybrid                   │
│    - Antenna → controlled by → RET                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓ installed via
┌─────────────────────────────────────────────────────────────────┐
│                       WORK ORDER DOMAIN                          │
├─────────────────────────────────────────────────────────────────┤
│  Project → Work Orders → Tasks                                   │
│                                                                   │
│  Work Order States:                                              │
│    DRAFT → PLANNED → ASSIGNED → IN_PROGRESS →                   │
│    TESTING → INSPECTION → PUNCH_LIST → COMPLETE                 │
│                                                                   │
│  Tasks:                                                           │
│    - Equipment installation                                      │
│    - Testing (PIM, VSWR, Fiber)                                  │
│    - Inspections                                                  │
│    - Punch list items                                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓ documents
┌─────────────────────────────────────────────────────────────────┐
│                         MEDIA DOMAIN                             │
├─────────────────────────────────────────────────────────────────┤
│  Photos                                                           │
│    ├─ Equipment photos                                           │
│    ├─ Site photos                                                │
│    ├─ Inspection photos                                          │
│    └─ Before/After comparisons                                   │
│                                                                   │
│  Documents                                                        │
│    ├─ Construction Drawings (PDFs)                               │
│    ├─ RF Designs                                                 │
│    ├─ Test Reports                                               │
│    ├─ Manuals                                                     │
│    └─ Closeout Packages                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓ creates
┌─────────────────────────────────────────────────────────────────┐
│                         EVENT DOMAIN                             │
├─────────────────────────────────────────────────────────────────┤
│  Events (Immutable Log)                                          │
│    - All state changes                                           │
│    - Complete audit trail                                        │
│    - Time-travel queries                                         │
│    - Sync reconciliation                                         │
│                                                                   │
│  Event Types:                                                     │
│    - SITE_CREATED, SITE_UPDATED                                  │
│    - EQUIPMENT_INSTALLED, EQUIPMENT_REMOVED                      │
│    - INSPECTION_COMPLETED                                        │
│    - TEST_PERFORMED                                               │
│    - WORK_ORDER_STATUS_CHANGED                                   │
│    - PHOTO_UPLOADED                                               │
│    - etc.                                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Detailed Entity Definitions

### Identity Domain

#### Companies
**Description:** Multi-tenant isolation boundary. Each company (contractor, carrier) has complete data isolation.

```typescript
interface Company {
  id: string                    // Primary key (ULID)
  name: string                  // "ABC Tower Construction"
  type: CompanyType             // CONTRACTOR | CARRIER | OWNER
  logo_url?: string
  settings: CompanySettings     // JSONB
  subscription_tier: string     // BASIC | PRO | ENTERPRISE
  created_at: Date
  updated_at: Date
}

interface CompanySettings {
  timezone: string
  date_format: string
  units: 'IMPERIAL' | 'METRIC'
  default_currency: string
  safety_protocols: object
}
```

**Relationships:**
- Company → Users (1:many)
- Company → Sites (1:many)
- Company → Teams (1:many)

---

#### Users
**Description:** People who use TowerOS (technicians, managers, inspectors, clients)

```typescript
interface User {
  id: string                    // Primary key (ULID)
  company_id: string            // Foreign key → companies
  email: string                 // Unique
  phone?: string
  first_name: string
  last_name: string
  role: UserRole                // ADMIN | MANAGER | FOREMAN | TECH | INSPECTOR | CLIENT
  avatar_url?: string
  certifications: Certification[] // JSONB array
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  last_active_at?: Date
  created_at: Date
  updated_at: Date
}

interface Certification {
  type: string                  // "OSHA_30", "TOWER_CLIMBER", "RF_SAFETY"
  issuer: string
  issued_date: Date
  expiry_date?: Date
  certificate_url?: string
}

type UserRole =
  | 'SUPER_ADMIN'               // Platform admin
  | 'COMPANY_ADMIN'             // Company owner
  | 'PROJECT_MANAGER'           // Manages projects
  | 'FOREMAN'                   // Leads crews
  | 'TECHNICIAN'                // Field tech
  | 'INSPECTOR'                 // QA/QC
  | 'CLIENT'                    // Read-only carrier access
```

**Relationships:**
- User → Company (many:1)
- User → Teams (many:many)
- User → Crews (many:many)
- User → Sessions (1:many)
- User → Devices (1:many)

---

#### Teams
**Description:** Organizational groups within a company (e.g., "East Coast Modernization Team")

```typescript
interface Team {
  id: string
  company_id: string
  name: string                  // "East Coast Modernization"
  description?: string
  manager_id: string            // User who manages this team
  members: string[]             // Array of user IDs (JSONB)
  created_at: Date
  updated_at: Date
}
```

---

#### Crews
**Description:** Field crews assigned to specific work (e.g., "Crew Delta - Tower Team")

```typescript
interface Crew {
  id: string
  company_id: string
  name: string                  // "Crew Delta"
  crew_lead_id: string          // Foreman
  members: string[]             // Technician user IDs
  specialization: string[]      // ["TOWER", "FIBER", "POWER"]
  status: 'AVAILABLE' | 'ASSIGNED' | 'OFFLINE'
  current_site_id?: string
  created_at: Date
  updated_at: Date
}
```

---

### Site Domain

#### Sites
**Description:** The root of the digital twin. Represents a physical cellular site.

```typescript
interface Site {
  id: string                    // Primary key (ULID)
  company_id: string            // Owner company

  // Identification
  name: string                  // "North Tower Alpha"
  site_code?: string            // Carrier's site identifier
  fa_number?: string            // FCC registration
  carrier: Carrier              // AT&T | VERIZON | TMOBILE | DISH

  // Location (PostGIS point)
  location: Point               // Geometry type
  latitude: number
  longitude: number
  address: Address              // JSONB
  elevation_ft: number          // Above sea level

  // Physical characteristics
  site_type: SiteType           // TOWER | ROOFTOP | MONOPOLE | SMALL_CELL
  tower_height_ft?: number
  structure_owner?: string

  // Status
  status: SiteStatus            // PLANNED | CONSTRUCTION | TESTING | ACTIVE | DECOMMISSIONED
  construction_start?: Date
  on_air_date?: Date

  // Metadata
  metadata: SiteMetadata        // JSONB (flexible for carrier-specific data)

  // Audit
  created_at: Date
  updated_at: Date
  created_by: string            // User ID
  updated_by: string
}

interface Address {
  street: string
  city: string
  state: string
  zip: string
  country: string
}

type Carrier = 'ATT' | 'VERIZON' | 'TMOBILE' | 'DISH' | 'US_CELLULAR' | 'OTHER'

type SiteType =
  | 'MONOPOLE'                  // Single pole
  | 'LATTICE_TOWER'             // Self-supporting lattice
  | 'GUYED_TOWER'               // Guy-wire supported
  | 'ROOFTOP'                   // Building rooftop
  | 'WATER_TANK'
  | 'SMALL_CELL'                // Street-level small cell
  | 'DAS'                       // Distributed antenna system

type SiteStatus =
  | 'PLANNED'                   // Designed, not started
  | 'PERMITTING'                // Awaiting permits
  | 'CONSTRUCTION'              // Active construction
  | 'TESTING'                   // Integration testing
  | 'INSPECTION'                // QA/QC inspection
  | 'PUNCH_LIST'                // Minor items remaining
  | 'ACCEPTED'                  // Carrier accepted
  | 'ON_AIR'                    // Live and serving traffic
  | 'MAINTENANCE'               // Scheduled maintenance
  | 'DECOMMISSIONED'            // Retired

interface SiteMetadata {
  carrier_site_id?: string
  market?: string
  region?: string
  site_classification?: string
  access_hours?: string
  access_requirements?: string[]
  emergency_contacts?: EmergencyContact[]
  [key: string]: any            // Flexible for carrier-specific fields
}
```

**Spatial Indexes:**
```sql
CREATE INDEX idx_sites_location ON sites USING GIST(location);
```

**Relationships:**
- Site → Sectors (1:many)
- Site → Equipment (1:many)
- Site → Work Orders (1:many)
- Site → Photos (1:many)
- Site → Documents (1:many)
- Site → Events (1:many)

---

#### Sectors
**Description:** A physical grouping of antennas (typically 3-4 per site: Alpha, Beta, Gamma)

```typescript
interface Sector {
  id: string
  site_id: string               // Foreign key → sites
  company_id: string

  // Identification
  name: string                  // "Alpha", "Beta", "Gamma", "Delta"
  sector_number: number         // 1, 2, 3, 4

  // RF Configuration
  azimuth: number               // Compass direction (0-360)
  beamwidth: number             // Antenna beamwidth (degrees)
  mechanical_tilt: number       // Physical tilt (degrees)
  electrical_tilt: number       // RET tilt (degrees)

  // Physical
  mount_height_ft: number       // Height on tower
  mount_type: string            // "PIPE_MOUNT", "ANGLE_BRACKET"

  // Bands
  bands: Band[]                 // JSONB array ["B2_1900", "B12_700", "B66_AWS"]

  // Status
  status: 'PLANNED' | 'INSTALLED' | 'TESTED' | 'ON_AIR' | 'DECOMMISSIONED'

  // Audit
  created_at: Date
  updated_at: Date
}

type Band =
  | 'B2_1900'                   // PCS
  | 'B4_AWS'
  | 'B5_850'                    // Cellular
  | 'B12_700'                   // Low-band
  | 'B13_700'                   // Verizon
  | 'B14_700'                   // FirstNet
  | 'B25_1900'
  | 'B26_850'
  | 'B66_AWS'
  | 'B71_600'                   // T-Mobile low-band
  | 'N2_1900'                   // 5G NR
  | 'N41_2500'                  // Mid-band 5G
  | 'N77_3700'                  // C-Band
  | 'N78_3500'
  | 'N261_28GHZ'                // mmWave
  | string                      // Future bands
```

**Relationships:**
- Sector → Site (many:1)
- Sector → Antennas (1:many)
- Sector → Radios (1:many)

---

### Equipment Domain

#### Equipment (Base Table)
**Description:** Base table for all physical equipment on a site. Uses polymorphic type pattern.

```typescript
interface Equipment {
  id: string                    // Primary key (ULID)
  site_id: string               // Foreign key → sites
  sector_id?: string            // Foreign key → sectors (if applicable)
  company_id: string

  // Classification
  equipment_type: EquipmentType
  category: EquipmentCategory

  // Manufacturer Info
  manufacturer: string          // "Ericsson", "Nokia", "Samsung"
  model: string                 // "AIR 6449"
  serial_number?: string        // Unique identifier
  firmware_version?: string

  // Physical Location
  mount_location: string        // "250' AGL - Northeast leg"
  mount_height_ft?: number
  gps_coordinates?: Point       // If separately tracked

  // Installation
  installation_date?: Date
  installed_by: string          // User ID
  crew_id?: string              // Crew that installed
  work_order_id?: string        // Work order reference

  // Status
  status: EquipmentStatus
  in_service_date?: Date
  removal_date?: Date

  // Specifications (flexible JSONB)
  specifications: EquipmentSpecs

  // Warranty
  warranty_start?: Date
  warranty_months?: number

  // Audit
  created_at: Date
  updated_at: Date
  created_by: string
  updated_by: string
}

type EquipmentType =
  | 'ANTENNA'
  | 'RADIO_RRU'                 // Remote Radio Unit
  | 'RADIO_BBU'                 // Baseband Unit
  | 'RET'                       // Remote Electrical Tilt
  | 'HYBRID_CABLE'
  | 'FIBER_CABLE'
  | 'COAX_CABLE'
  | 'POWER_CABLE'
  | 'RECTIFIER'
  | 'BATTERY'
  | 'BREAKER'
  | 'GROUNDING_KIT'
  | 'MOUNT'
  | 'BRACKET'
  | 'CABINET'
  | 'MICROWAVE_DISH'
  | 'GPS_ANTENNA'
  | 'JUMPER'
  | 'SURGE_PROTECTOR'

type EquipmentCategory =
  | 'RF'                        // Radio frequency equipment
  | 'POWER'                     // DC power system
  | 'STRUCTURAL'                // Mounts, brackets
  | 'CONNECTIVITY'              // Cables, fiber
  | 'SAFETY'                    // Grounding, surge
  | 'BACKHAUL'                  // Microwave, fiber
  | 'MONITORING'                // Alarms, sensors

type EquipmentStatus =
  | 'ORDERED'                   // Material ordered
  | 'RECEIVED'                  // In inventory
  | 'STAGED'                    // At site, not installed
  | 'INSTALLED'                 // Physically installed
  | 'TESTED'                    // Passed testing
  | 'IN_SERVICE'                // Live and serving
  | 'FAILED'                    // Failed or faulty
  | 'REMOVED'                   // Decommissioned

interface EquipmentSpecs {
  // Varies by equipment type
  [key: string]: any

  // Examples for Radio:
  // frequency_bands?: string[]
  // power_output_watts?: number
  // channels?: number
  // mimo_configuration?: string  // "4x4", "8x8"

  // Examples for Antenna:
  // frequency_range?: string     // "1710-2180 MHz"
  // gain_dbi?: number
  // polarization?: string        // "X-POL", "V-POL"
  // connector_type?: string      // "7/16 DIN", "4.3-10"

  // Examples for Hybrid Cable:
  // fiber_count?: number
  // dc_conductor_gauge?: string  // "6 AWG"
  // length_ft?: number
}
```

**Relationships:**
- Equipment → Site (many:1)
- Equipment → Sector (many:1, optional)
- Equipment → Work Order (many:1, optional)
- Equipment → Equipment Connections (many:many via junction)
- Equipment → Photos (1:many)
- Equipment → Test Results (1:many)

---

#### Equipment_Connections (Graph Relationships)
**Description:** Captures how equipment is physically connected (radio to antenna, fiber to port, etc.)

```typescript
interface EquipmentConnection {
  id: string
  company_id: string

  // Source and destination
  from_equipment_id: string     // Foreign key → equipment
  to_equipment_id: string       // Foreign key → equipment

  // Connection details
  connection_type: ConnectionType
  from_port?: string            // "Port 1", "Output A"
  to_port?: string              // "Input 1"

  // Physical details
  cable_length_ft?: number
  cable_type?: string
  connector_types?: string[]    // ["7/16 DIN", "LC/APC"]

  // Testing
  tested_at?: Date
  test_results?: object         // JSONB

  // Status
  status: 'PLANNED' | 'INSTALLED' | 'TESTED' | 'ACTIVE' | 'DISCONNECTED'

  // Audit
  created_at: Date
  updated_at: Date
}

type ConnectionType =
  | 'RF_PATH'                   // Radio → Antenna via hybrid
  | 'FIBER'                     // Fiber connection
  | 'POWER'                     // Power feed
  | 'RET_CONTROL'               // RET control cable
  | 'ETHERNET'                  // Network cable
  | 'AISG'                      // Antenna Interface Standards Group
  | 'ALARM'                     // Alarm circuits
```

**Graph Queries:**
```sql
-- Find complete signal path from radio to antenna
WITH RECURSIVE signal_path AS (
  SELECT
    from_equipment_id,
    to_equipment_id,
    connection_type,
    1 as depth,
    ARRAY[from_equipment_id] as path
  FROM equipment_connections
  WHERE from_equipment_id = 'radio_123'
    AND connection_type = 'RF_PATH'

  UNION ALL

  SELECT
    ec.from_equipment_id,
    ec.to_equipment_id,
    ec.connection_type,
    sp.depth + 1,
    sp.path || ec.from_equipment_id
  FROM equipment_connections ec
  JOIN signal_path sp ON ec.from_equipment_id = sp.to_equipment_id
  WHERE NOT (ec.from_equipment_id = ANY(sp.path))
    AND sp.depth < 10
)
SELECT * FROM signal_path;
```

---

### Work Order Domain

#### Projects
**Description:** Collection of related work orders (e.g., "Q4 2026 Modernization")

```typescript
interface Project {
  id: string
  company_id: string
  name: string                  // "Q4 2026 Modernization"
  description?: string
  client: string                // Carrier name
  start_date: Date
  end_date?: Date
  budget?: number
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
  project_manager_id: string    // User ID
  created_at: Date
  updated_at: Date
}
```

---

#### Work Orders
**Description:** Specific work to be performed at a site

```typescript
interface WorkOrder {
  id: string
  company_id: string
  project_id?: string           // Foreign key → projects
  site_id: string               // Foreign key → sites

  // Identification
  work_order_number: string     // "WO-2026-001234"
  title: string                 // "Install 5G NR equipment"
  description?: string
  work_type: WorkType

  // Scheduling
  scheduled_start: Date
  scheduled_end: Date
  actual_start?: Date
  actual_end?: Date

  // Assignment
  assigned_to_crew_id?: string
  assigned_to_user_id?: string  // Individual assignment
  assigned_by: string

  // Status
  status: WorkOrderStatus
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'

  // Progress
  progress_percentage: number   // 0-100
  tasks_completed: number
  tasks_total: number

  // Financials
  estimated_cost?: number
  actual_cost?: number
  labor_hours_estimated?: number
  labor_hours_actual?: number

  // Carrier
  carrier_po?: string           // Purchase order
  carrier_contact?: string

  // Audit
  created_at: Date
  updated_at: Date
  created_by: string
  updated_by: string
}

type WorkType =
  | 'NEW_BUILD'                 // New site construction
  | 'MODERNIZATION'             // Equipment upgrade
  | 'DECOMMISSION'              // Equipment removal
  | 'MAINTENANCE'               // Scheduled maintenance
  | 'REPAIR'                    // Break-fix
  | 'INSPECTION'                // QA/QC inspection
  | 'TESTING'                   // Integration testing
  | 'EMERGENCY'                 // Outage response

type WorkOrderStatus =
  | 'DRAFT'                     // Being planned
  | 'SCHEDULED'                 // On calendar
  | 'ASSIGNED'                  // Crew assigned
  | 'MOBILIZED'                 // Crew en route
  | 'IN_PROGRESS'               // Work started
  | 'ON_HOLD'                   // Temporarily stopped
  | 'TESTING'                   // Integration testing
  | 'INSPECTION'                // Awaiting inspection
  | 'PUNCH_LIST'                // Minor items remain
  | 'COMPLETED'                 // Work complete
  | 'ACCEPTED'                  // Client accepted
  | 'CANCELLED'                 // Cancelled
```

---

#### Tasks
**Description:** Individual tasks within a work order

```typescript
interface Task {
  id: string
  work_order_id: string         // Foreign key → work_orders
  company_id: string

  // Details
  title: string                 // "Install Alpha sector antenna"
  description?: string
  task_type: TaskType
  sequence_number: number       // Order of execution

  // Assignment
  assigned_to: string           // User ID
  assigned_by: string

  // Equipment
  equipment_id?: string         // Related equipment

  // Status
  status: 'PENDING' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED' | 'SKIPPED'
  blocked_reason?: string

  // Time tracking
  estimated_minutes?: number
  actual_start?: Date
  actual_end?: Date
  actual_minutes?: number

  // Checklist
  checklist_items?: ChecklistItem[]  // JSONB

  // Results
  result?: TaskResult           // JSONB (test results, measurements, etc.)

  // Audit
  created_at: Date
  updated_at: Date
  completed_at?: Date
  completed_by?: string
}

type TaskType =
  | 'SAFETY_BRIEFING'
  | 'SITE_SURVEY'
  | 'MATERIAL_STAGING'
  | 'EQUIPMENT_INSTALLATION'
  | 'CABLE_ROUTING'
  | 'FIBER_TERMINATION'
  | 'POWER_INSTALLATION'
  | 'GROUNDING'
  | 'TESTING_PIM'
  | 'TESTING_VSWR'
  | 'TESTING_FIBER'
  | 'TESTING_POWER'
  | 'INSPECTION'
  | 'DOCUMENTATION'
  | 'PUNCH_LIST_ITEM'
  | 'CLEANUP'

interface ChecklistItem {
  id: string
  label: string
  completed: boolean
  completed_by?: string
  completed_at?: Date
  notes?: string
}

interface TaskResult {
  test_type?: string
  passed: boolean
  measurements?: Record<string, any>
  notes?: string
  attachments?: string[]        // Photo/document IDs
}
```

---

### Media Domain

#### Photos
**Description:** All photos taken in the field

```typescript
interface Photo {
  id: string
  company_id: string

  // Context
  site_id?: string              // Foreign key → sites
  equipment_id?: string         // Foreign key → equipment
  work_order_id?: string        // Foreign key → work_orders
  task_id?: string              // Foreign key → tasks

  // File storage
  filename: string
  original_url: string          // S3 URL for full resolution
  thumbnail_url: string         // Optimized thumbnail
  file_size_bytes: number
  mime_type: string
  dimensions: PhotoDimensions

  // Metadata
  caption?: string
  category: PhotoCategory
  tags?: string[]               // JSONB array

  // EXIF data
  taken_at: Date                // From EXIF or upload time
  gps_latitude?: number
  gps_longitude?: number
  device_model?: string
  camera_settings?: object      // JSONB

  // Uploaded by
  uploaded_by: string           // User ID
  uploaded_from_device: string

  // Processing
  is_processed: boolean         // Thumbnail generated
  is_analyzed: boolean          // AI analysis complete
  ai_tags?: string[]            // Auto-generated tags

  // Audit
  created_at: Date
  updated_at: Date
}

interface PhotoDimensions {
  width: number
  height: number
}

type PhotoCategory =
  | 'SITE_OVERVIEW'
  | 'EQUIPMENT_INSTALLED'
  | 'EQUIPMENT_CLOSEUP'
  | 'BEFORE'
  | 'AFTER'
  | 'INSPECTION_FINDING'
  | 'SAFETY_ISSUE'
  | 'TEST_RESULT'
  | 'LABEL'
  | 'DOCUMENTATION'
  | 'DAMAGE'
  | 'OTHER'
```

---

#### Documents
**Description:** PDFs, drawings, manuals, reports

```typescript
interface Document {
  id: string
  company_id: string

  // Context
  site_id?: string
  work_order_id?: string
  project_id?: string

  // File
  filename: string
  url: string                   // S3 URL
  file_size_bytes: number
  mime_type: string             // "application/pdf", etc.

  // Classification
  document_type: DocumentType
  title: string
  description?: string
  version?: string              // For drawings: "Rev A", "Rev B"

  // Metadata
  tags?: string[]
  is_public: boolean            // Accessible to client?

  // Text extraction (for search)
  extracted_text?: string       // Full-text index
  page_count?: number

  // Uploaded by
  uploaded_by: string
  uploaded_at: Date

  // Audit
  created_at: Date
  updated_at: Date
}

type DocumentType =
  | 'CONSTRUCTION_DRAWING'
  | 'RF_DESIGN'
  | 'STRUCTURAL_DRAWING'
  | 'SITE_PLAN'
  | 'TEST_REPORT'
  | 'INSPECTION_REPORT'
  | 'CLOSEOUT_PACKAGE'
  | 'MANUAL'
  | 'SPEC_SHEET'
  | 'PERMIT'
  | 'LEASE_AGREEMENT'
  | 'INSURANCE_CERTIFICATE'
  | 'SAFETY_PLAN'
  | 'OTHER'
```

---

### Event Domain

#### Events
**Description:** Immutable log of all state changes (see ADR 002)

```typescript
interface DomainEvent {
  // Identity
  id: string                    // ULID
  type: string                  // Event type
  aggregate_type: string        // "Site", "Equipment", "WorkOrder"
  aggregate_id: string          // Entity this event applies to

  // Temporal
  timestamp: number             // Unix milliseconds (device time)
  server_timestamp: number      // Server received (UTC)

  // Causality
  vector_clock: Record<string, number>
  causation_id?: string         // Event that caused this
  correlation_id?: string       // Related event chain

  // Context
  company_id: string
  user_id: string
  device_id: string
  session_id: string

  // Payload
  payload: Record<string, any>
  metadata?: Record<string, any>

  // Versioning
  version: number               // Event schema version

  // Audit
  created_at: Date
}
```

**Indexes:**
```sql
CREATE INDEX idx_events_aggregate ON events(aggregate_type, aggregate_id, timestamp);
CREATE INDEX idx_events_type ON events(type, timestamp);
CREATE INDEX idx_events_correlation ON events(correlation_id) WHERE correlation_id IS NOT NULL;
CREATE INDEX idx_events_company ON events(company_id, timestamp);
CREATE INDEX idx_events_payload ON events USING GIN(payload jsonb_path_ops);
```

---

## Key Relationships Summary

### Digital Twin Hierarchy
```
Company
  └─ Site
      ├─ Location (PostGIS point)
      ├─ Metadata
      └─ Sectors
          └─ Equipment (graph)
              ├─ Antennas
              ├─ Radios
              ├─ Cables
              ├─ Power
              └─ Connections
```

### Work Flow
```
Project
  └─ Work Orders
      └─ Tasks
          ├─ Assigned to User/Crew
          ├─ Related to Equipment
          └─ Documented by Photos/Documents
```

### Audit Trail
```
Everything → Events (immutable log)
  └─ Time-travel queries
  └─ Complete forensics
  └─ Sync reconciliation
```

---

## Multi-Tenancy Strategy

**Row-Level Security (RLS):**

```sql
-- Enable RLS on all tables
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
-- etc.

-- Policy: Users can only see data from their company
CREATE POLICY company_isolation ON sites
  USING (company_id = current_setting('app.current_company_id')::text);

CREATE POLICY company_isolation ON equipment
  USING (company_id = current_setting('app.current_company_id')::text);

-- Set company context from JWT
SET app.current_company_id = 'company_abc123';
```

**Application-Level:**
- All queries filtered by company_id from JWT
- Middleware validates company access
- No cross-company data leakage

---

## Next Steps

1. ✅ ER diagram and entity definitions complete
2. ⏳ PostgreSQL schema (Drizzle ORM)
3. ⏳ Migrations strategy
4. ⏳ Seed data for testing
5. ⏳ API contracts

---

**This database design captures the complete digital twin of telecommunications infrastructure with full traceability, spatial awareness, and multi-tenant isolation.**
