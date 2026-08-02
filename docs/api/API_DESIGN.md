# TowerOS API Design

**Version:** 1.0.0
**Last Updated:** 2026-08-02

---

## Overview

The TowerOS API is a RESTful API with WebSocket support for real-time updates. It follows these principles:

1. **RESTful** - Resource-based URLs, standard HTTP methods
2. **Type-Safe** - OpenAPI 3.1 specification with code generation
3. **Versioned** - All endpoints prefixed with `/api/v1`
4. **Authenticated** - JWT-based authentication required
5. **Rate Limited** - Protect against abuse
6. **Well-Documented** - OpenAPI spec generates interactive docs

---

## Base URL

**Development:** `http://localhost:3000/api/v1`
**Production:** `https://api.toweros.com/api/v1`

---

## Authentication

### JWT-Based Authentication

All requests (except `/auth/*`) require an `Authorization` header:

```http
Authorization: Bearer <access_token>
```

### Token Flow

```
1. User logs in → POST /auth/login
2. Server returns { accessToken, refreshToken }
3. Client stores tokens securely
4. Client includes accessToken in Authorization header
5. When accessToken expires (15 min) → POST /auth/refresh
6. Server returns new accessToken
7. Repeat until refreshToken expires (7 days)
```

### Token Structure

**Access Token (JWT):**
```json
{
  "sub": "user_abc123",
  "companyId": "company_xyz789",
  "role": "TECHNICIAN",
  "deviceId": "device_123",
  "iat": 1722604800,
  "exp": 1722605700
}
```

**Refresh Token:**
- Opaque string stored in database
- One refresh token per device
- Can be revoked

---

## API Structure

### Domain-Based Organization

```
/api/v1/
├── auth/              # Authentication & authorization
├── users/             # User management
├── companies/         # Company management
├── sites/             # Site management (digital twin)
├── sectors/           # Sector management
├── equipment/         # Equipment & connections
├── work-orders/       # Work order workflows
├── tasks/             # Task management
├── photos/            # Photo upload & retrieval
├── documents/         # Document management
├── events/            # Event log queries
├── sync/              # Offline sync endpoints
└── analytics/         # Reporting & analytics
```

---

## Common Patterns

### Pagination

All list endpoints support pagination:

```http
GET /api/v1/sites?page=1&limit=50
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 245,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Filtering

Use query parameters for filtering:

```http
GET /api/v1/sites?status=ACTIVE&carrier=ATT
GET /api/v1/equipment?siteId=site_123&type=RADIO_RRU
```

### Sorting

```http
GET /api/v1/sites?sortBy=createdAt&sortOrder=desc
```

### Field Selection (Sparse Fieldsets)

```http
GET /api/v1/sites?fields=id,name,status
```

### Including Related Resources

```http
GET /api/v1/sites/site_123?include=sectors,equipment,workOrders
```

### Search

```http
GET /api/v1/sites/search?q=tower+alpha
```

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid site data",
    "details": [
      {
        "field": "latitude",
        "message": "Must be between -90 and 90"
      }
    ],
    "requestId": "req_abc123",
    "timestamp": "2026-08-02T10:30:00Z"
  }
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable Entity | Business logic error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |
| 503 | Service Unavailable | Maintenance mode |

### Error Codes

```typescript
type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_REQUIRED'
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'INSUFFICIENT_PERMISSIONS'
  | 'RESOURCE_NOT_FOUND'
  | 'DUPLICATE_RESOURCE'
  | 'BUSINESS_LOGIC_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'
```

---

## Rate Limiting

### Limits

- **Anonymous:** 10 requests/minute
- **Authenticated:** 100 requests/minute
- **Premium:** 1000 requests/minute

### Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1722604900
```

### Rate Limit Exceeded Response

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Try again in 60 seconds.",
    "retryAfter": 60
  }
}
```

---

## API Endpoints

### Authentication

#### POST /auth/register
Register a new user (company admin)

**Request:**
```json
{
  "company": {
    "name": "ABC Tower Construction",
    "type": "CONTRACTOR"
  },
  "user": {
    "email": "admin@abc-tower.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1-555-0100"
  }
}
```

**Response (201):**
```json
{
  "company": { "id": "company_123", ... },
  "user": { "id": "user_123", ... },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "rt_abc123...",
    "expiresIn": 900
  }
}
```

#### POST /auth/login
Authenticate user

**Request:**
```json
{
  "email": "tech@abc-tower.com",
  "password": "SecurePassword123!",
  "deviceId": "device_123",
  "deviceName": "iPhone 15 Pro"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "user_123",
    "email": "tech@abc-tower.com",
    "firstName": "Mike",
    "lastName": "Johnson",
    "role": "TECHNICIAN",
    "companyId": "company_123"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "rt_abc123...",
    "expiresIn": 900
  }
}
```

#### POST /auth/refresh
Refresh access token

**Request:**
```json
{
  "refreshToken": "rt_abc123..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGc...",
  "expiresIn": 900
}
```

#### POST /auth/logout
Logout (invalidate refresh token)

**Request:**
```json
{
  "refreshToken": "rt_abc123..."
}
```

**Response (204):** No content

---

### Sites

#### GET /sites
List all sites (paginated)

**Query Params:**
- `page` (default: 1)
- `limit` (default: 50, max: 100)
- `status` (filter by status)
- `carrier` (filter by carrier)
- `search` (search name/code)
- `sortBy` (default: createdAt)
- `sortOrder` (asc/desc, default: desc)
- `include` (sectors, equipment, workOrders)

**Response (200):**
```json
{
  "data": [
    {
      "id": "site_123",
      "name": "North Tower Alpha",
      "siteCode": "ATT-SF-001",
      "carrier": "ATT",
      "location": {
        "latitude": 37.7749,
        "longitude": -122.4194,
        "address": {
          "street": "123 Tower Rd",
          "city": "San Francisco",
          "state": "CA",
          "zip": "94102"
        }
      },
      "siteType": "MONOPOLE",
      "status": "ACTIVE",
      "towerHeightFt": 150,
      "onAirDate": "2025-06-15",
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

#### GET /sites/:id
Get site by ID

**Query Params:**
- `include` (sectors, equipment, workOrders, photos, documents)

**Response (200):**
```json
{
  "id": "site_123",
  "name": "North Tower Alpha",
  "siteCode": "ATT-SF-001",
  "carrier": "ATT",
  "location": { ... },
  "siteType": "MONOPOLE",
  "status": "ACTIVE",
  "sectors": [
    {
      "id": "sector_alpha",
      "name": "Alpha",
      "azimuth": 45,
      "mountHeightFt": 140
    }
  ],
  "equipment": [ ... ],
  "workOrders": [ ... ]
}
```

#### POST /sites
Create new site

**Request:**
```json
{
  "name": "North Tower Alpha",
  "siteCode": "ATT-SF-001",
  "carrier": "ATT",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "address": {
    "street": "123 Tower Rd",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94102",
    "country": "USA"
  },
  "siteType": "MONOPOLE",
  "towerHeightFt": 150,
  "elevationFt": 50
}
```

**Response (201):**
```json
{
  "id": "site_123",
  "name": "North Tower Alpha",
  ...
}
```

#### PATCH /sites/:id
Update site

**Request:**
```json
{
  "status": "CONSTRUCTION",
  "constructionStart": "2026-08-15"
}
```

**Response (200):**
```json
{
  "id": "site_123",
  "status": "CONSTRUCTION",
  ...
}
```

#### DELETE /sites/:id
Delete site (soft delete)

**Response (204):** No content

#### GET /sites/:id/timeline
Get complete site timeline (event sourcing)

**Query Params:**
- `startDate` (ISO 8601)
- `endDate` (ISO 8601)
- `eventTypes` (comma-separated)

**Response (200):**
```json
{
  "siteId": "site_123",
  "timeline": [
    {
      "id": "evt_123",
      "type": "SITE_CREATED",
      "timestamp": "2026-01-15T10:00:00Z",
      "user": {
        "id": "user_123",
        "name": "John Doe"
      },
      "payload": { ... }
    },
    {
      "id": "evt_124",
      "type": "EQUIPMENT_INSTALLED",
      "timestamp": "2026-03-20T14:30:00Z",
      "user": {
        "id": "user_456",
        "name": "Mike Johnson"
      },
      "payload": {
        "equipmentType": "RADIO_RRU",
        "model": "AIR 6449",
        "serialNumber": "ABC-123"
      }
    }
  ]
}
```

#### GET /sites/nearby
Find sites near location (spatial query)

**Query Params:**
- `latitude` (required)
- `longitude` (required)
- `radiusKm` (default: 50)
- `limit` (default: 10)

**Response (200):**
```json
{
  "data": [
    {
      "id": "site_123",
      "name": "North Tower Alpha",
      "distanceKm": 2.5,
      "location": { ... }
    }
  ]
}
```

---

### Equipment

#### GET /equipment
List equipment (paginated)

**Query Params:**
- `siteId` (filter by site)
- `sectorId` (filter by sector)
- `type` (filter by equipment type)
- `status` (filter by status)
- `manufacturer` (filter by manufacturer)

**Response (200):**
```json
{
  "data": [
    {
      "id": "equip_123",
      "siteId": "site_123",
      "sectorId": "sector_alpha",
      "equipmentType": "RADIO_RRU",
      "manufacturer": "Ericsson",
      "model": "AIR 6449",
      "serialNumber": "ABC-123-XYZ",
      "status": "IN_SERVICE",
      "installationDate": "2026-03-20",
      "installedBy": {
        "id": "user_456",
        "name": "Mike Johnson"
      }
    }
  ],
  "pagination": { ... }
}
```

#### POST /equipment
Install new equipment

**Request:**
```json
{
  "siteId": "site_123",
  "sectorId": "sector_alpha",
  "equipmentType": "RADIO_RRU",
  "category": "RF",
  "manufacturer": "Ericsson",
  "model": "AIR 6449",
  "serialNumber": "ABC-123-XYZ",
  "mountLocation": "140' AGL - Northeast leg",
  "mountHeightFt": 140,
  "workOrderId": "wo_123",
  "specifications": {
    "frequencyBands": ["B2_1900", "B66_AWS"],
    "powerOutputWatts": 60,
    "mimoConfiguration": "4x4"
  }
}
```

**Response (201):**
```json
{
  "id": "equip_123",
  "equipmentType": "RADIO_RRU",
  ...
}
```

#### GET /equipment/:id/connections
Get equipment connection graph

**Response (200):**
```json
{
  "equipment": {
    "id": "equip_radio_123",
    "type": "RADIO_RRU",
    "model": "AIR 6449"
  },
  "connections": {
    "outgoing": [
      {
        "id": "conn_123",
        "connectionType": "RF_PATH",
        "to": {
          "id": "equip_ant_456",
          "type": "ANTENNA",
          "model": "Panel Array"
        },
        "via": {
          "id": "equip_hybrid_789",
          "type": "HYBRID_CABLE",
          "lengthFt": 150
        }
      },
      {
        "id": "conn_124",
        "connectionType": "FIBER",
        "to": {
          "id": "equip_bbu_999",
          "type": "RADIO_BBU"
        }
      }
    ],
    "incoming": [
      {
        "id": "conn_125",
        "connectionType": "POWER",
        "from": {
          "id": "equip_breaker_111",
          "type": "BREAKER",
          "amperage": 60
        }
      }
    ]
  }
}
```

#### POST /equipment/:id/test
Record test result

**Request:**
```json
{
  "testType": "PIM",
  "result": "PASS",
  "measurements": {
    "pimLevel": -110,
    "frequency": 1900
  },
  "metadata": {
    "temperature": 72,
    "weather": "Clear",
    "testEquipment": "Anritsu S412E"
  }
}
```

**Response (201):**
```json
{
  "id": "test_123",
  "equipmentId": "equip_123",
  "testType": "PIM",
  "result": "PASS",
  "passed": true,
  "measurements": { ... },
  "testedBy": {
    "id": "user_456",
    "name": "Mike Johnson"
  },
  "testedAt": "2026-03-20T15:30:00Z"
}
```

---

### Work Orders

#### GET /work-orders
List work orders (paginated)

**Query Params:**
- `siteId` (filter by site)
- `status` (filter by status)
- `assignedToCrewId` (filter by crew)
- `assignedToUserId` (filter by user)
- `priority` (filter by priority)

**Response (200):**
```json
{
  "data": [
    {
      "id": "wo_123",
      "workOrderNumber": "WO-2026-001234",
      "title": "Install 5G NR equipment",
      "siteId": "site_123",
      "siteName": "North Tower Alpha",
      "workType": "MODERNIZATION",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "scheduledStart": "2026-08-15T08:00:00Z",
      "scheduledEnd": "2026-08-15T17:00:00Z",
      "assignedToCrew": {
        "id": "crew_delta",
        "name": "Crew Delta"
      },
      "progressPercentage": 65,
      "tasksCompleted": 13,
      "tasksTotal": 20
    }
  ],
  "pagination": { ... }
}
```

#### POST /work-orders
Create work order

**Request:**
```json
{
  "siteId": "site_123",
  "projectId": "proj_abc",
  "title": "Install 5G NR equipment",
  "description": "Modernize site with 5G radio and antennas",
  "workType": "MODERNIZATION",
  "priority": "HIGH",
  "scheduledStart": "2026-08-15T08:00:00Z",
  "scheduledEnd": "2026-08-15T17:00:00Z",
  "assignedToCrewId": "crew_delta",
  "estimatedCost": 15000,
  "laborHoursEstimated": 16
}
```

**Response (201):**
```json
{
  "id": "wo_123",
  "workOrderNumber": "WO-2026-001234",
  ...
}
```

#### PATCH /work-orders/:id/status
Update work order status

**Request:**
```json
{
  "status": "IN_PROGRESS",
  "notes": "Crew arrived on site, beginning work"
}
```

**Response (200):**
```json
{
  "id": "wo_123",
  "status": "IN_PROGRESS",
  "actualStart": "2026-08-15T08:15:00Z"
}
```

#### GET /work-orders/:id/tasks
Get tasks for work order

**Response (200):**
```json
{
  "workOrderId": "wo_123",
  "tasks": [
    {
      "id": "task_1",
      "title": "Safety briefing",
      "taskType": "SAFETY_BRIEFING",
      "sequenceNumber": 1,
      "status": "COMPLETED",
      "assignedTo": {
        "id": "user_456",
        "name": "Mike Johnson"
      },
      "completedAt": "2026-08-15T08:30:00Z"
    },
    {
      "id": "task_2",
      "title": "Install Alpha sector antenna",
      "taskType": "EQUIPMENT_INSTALLATION",
      "sequenceNumber": 2,
      "status": "IN_PROGRESS",
      "assignedTo": {
        "id": "user_456",
        "name": "Mike Johnson"
      },
      "equipmentId": "equip_new_ant"
    }
  ]
}
```

#### POST /work-orders/:id/tasks
Create task

**Request:**
```json
{
  "title": "Install Alpha sector antenna",
  "taskType": "EQUIPMENT_INSTALLATION",
  "sequenceNumber": 2,
  "assignedTo": "user_456",
  "equipmentId": "equip_123",
  "estimatedMinutes": 120,
  "checklistItems": [
    { "label": "Verify torque specs", "completed": false },
    { "label": "Take before photo", "completed": false },
    { "label": "Install equipment", "completed": false },
    { "label": "Take after photo", "completed": false }
  ]
}
```

**Response (201):**
```json
{
  "id": "task_2",
  "title": "Install Alpha sector antenna",
  ...
}
```

#### PATCH /tasks/:id
Update task

**Request:**
```json
{
  "status": "COMPLETED",
  "actualMinutes": 135,
  "result": {
    "passed": true,
    "notes": "Installation successful, torque verified"
  }
}
```

**Response (200):**
```json
{
  "id": "task_2",
  "status": "COMPLETED",
  "completedAt": "2026-08-15T10:45:00Z",
  ...
}
```

---

### Photos

#### POST /photos/upload
Upload photo

**Request (multipart/form-data):**
```
file: <binary>
siteId: site_123
equipmentId: equip_456
category: EQUIPMENT_INSTALLED
caption: "Alpha sector radio installed"
```

**Response (201):**
```json
{
  "id": "photo_123",
  "filename": "IMG_0042.jpg",
  "originalUrl": "https://cdn.toweros.com/photos/original/photo_123.jpg",
  "thumbnailUrl": "https://cdn.toweros.com/photos/thumb/photo_123.jpg",
  "fileSizeBytes": 2458624,
  "dimensions": {
    "width": 4032,
    "height": 3024
  },
  "category": "EQUIPMENT_INSTALLED",
  "takenAt": "2026-08-15T10:30:00Z",
  "gpsLatitude": 37.7749,
  "gpsLongitude": -122.4194
}
```

#### GET /photos
List photos (paginated)

**Query Params:**
- `siteId` (filter by site)
- `equipmentId` (filter by equipment)
- `workOrderId` (filter by work order)
- `category` (filter by category)
- `startDate` (filter by date range)
- `endDate` (filter by date range)

**Response (200):**
```json
{
  "data": [
    {
      "id": "photo_123",
      "thumbnailUrl": "https://cdn.toweros.com/photos/thumb/photo_123.jpg",
      "category": "EQUIPMENT_INSTALLED",
      "caption": "Alpha sector radio installed",
      "takenAt": "2026-08-15T10:30:00Z",
      "uploadedBy": {
        "id": "user_456",
        "name": "Mike Johnson"
      }
    }
  ],
  "pagination": { ... }
}
```

---

### Sync

#### POST /sync/push
Push events from offline device

**Request:**
```json
{
  "deviceId": "device_123",
  "events": [
    {
      "id": "evt_local_1",
      "type": "EQUIPMENT_INSTALLED",
      "aggregateType": "Equipment",
      "aggregateId": "equip_temp_123",
      "timestamp": 1722604800000,
      "vectorClock": { "device_123": 42 },
      "payload": {
        "siteId": "site_123",
        "manufacturer": "Ericsson",
        "model": "AIR 6449",
        "serialNumber": "ABC-123"
      }
    }
  ]
}
```

**Response (200):**
```json
{
  "synced": [
    {
      "localId": "evt_local_1",
      "serverId": "evt_server_456",
      "status": "SYNCED"
    }
  ],
  "conflicts": [],
  "failed": []
}
```

#### GET /sync/pull
Pull updates since last sync

**Query Params:**
- `deviceId` (required)
- `since` (timestamp, required)

**Response (200):**
```json
{
  "events": [
    {
      "id": "evt_789",
      "type": "WORK_ORDER_ASSIGNED",
      "aggregateType": "WorkOrder",
      "aggregateId": "wo_123",
      "timestamp": 1722605000000,
      "payload": { ... }
    }
  ],
  "deletions": [
    {
      "aggregateType": "Equipment",
      "aggregateId": "equip_removed"
    }
  ],
  "lastSyncTimestamp": 1722605100000
}
```

---

## WebSocket Events

### Connection

```typescript
const ws = new WebSocket('wss://api.toweros.com/ws')

// Send authentication
ws.send(JSON.stringify({
  type: 'AUTH',
  token: accessToken
}))

// Subscribe to channels
ws.send(JSON.stringify({
  type: 'SUBSCRIBE',
  channels: ['site:site_123', 'workOrder:wo_456']
}))
```

### Real-Time Events

```typescript
// Equipment installed
{
  "type": "EQUIPMENT_INSTALLED",
  "channel": "site:site_123",
  "data": {
    "equipmentId": "equip_new",
    "siteId": "site_123",
    "equipmentType": "RADIO_RRU",
    "installedBy": {
      "id": "user_456",
      "name": "Mike Johnson"
    }
  },
  "timestamp": "2026-08-15T10:30:00Z"
}

// Task completed
{
  "type": "TASK_COMPLETED",
  "channel": "workOrder:wo_456",
  "data": {
    "taskId": "task_2",
    "workOrderId": "wo_456",
    "completedBy": {
      "id": "user_456",
      "name": "Mike Johnson"
    }
  },
  "timestamp": "2026-08-15T10:45:00Z"
}

// Sync status update
{
  "type": "SYNC_COMPLETE",
  "channel": "device:device_123",
  "data": {
    "eventsSynced": 5,
    "conflicts": 0
  }
}
```

---

## Validation

All requests validated using Zod schemas:

```typescript
// Example: Site creation schema
const createSiteSchema = z.object({
  name: z.string().min(1).max(255),
  siteCode: z.string().optional(),
  carrier: z.enum(['ATT', 'VERIZON', 'TMOBILE', 'DISH', 'US_CELLULAR', 'OTHER']),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string().length(2),
    zip: z.string().regex(/^\d{5}$/),
    country: z.string().default('USA'),
  }),
  siteType: z.enum(['MONOPOLE', 'LATTICE_TOWER', 'GUYED_TOWER', 'ROOFTOP', 'WATER_TANK', 'SMALL_CELL', 'DAS']),
  towerHeightFt: z.number().positive().optional(),
  elevationFt: z.number().optional(),
})
```

---

## Next Steps

1. ✅ API design complete
2. ⏳ Generate OpenAPI 3.1 specification
3. ⏳ Implement Fastify routes
4. ⏳ Generate TypeScript client
5. ⏳ API documentation site

---

**This API design provides the complete interface for TowerOS, enabling field technicians, project managers, and automated systems to interact with the digital twin.**
