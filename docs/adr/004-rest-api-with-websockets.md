# ADR 004: REST API with WebSockets for Real-Time Updates

**Status:** Accepted
**Date:** 2026-08-02
**Decision Makers:** Architecture Team
**Context:** TowerOS API Design

---

## Context

TowerOS needs an API that serves multiple client types:
- Mobile apps (iOS/Android) - Primary users are field technicians
- Web dashboard - Project managers and office staff
- Third-party integrations - Carrier systems, ERP systems
- Automated systems - Monitoring, alerts, reporting

The API must support:
1. **Offline-first workflows** - Mobile clients work offline and sync later
2. **Real-time updates** - Dashboard shows live progress from field
3. **Large file uploads** - Photos and documents
4. **Complex queries** - Equipment graphs, site timelines, spatial searches
5. **Event streaming** - Event sourcing requires efficient event delivery
6. **Multi-tenancy** - Complete data isolation between companies

## Decision

We will build a **RESTful API with WebSocket support** using:

- **REST** for CRUD operations and queries
- **WebSockets** for real-time bidirectional communication
- **OpenAPI 3.1** for specification and documentation
- **Fastify** as the Node.js framework
- **Zod** for runtime validation
- **JWT** for authentication

### API Architecture

```
Client (Mobile/Web)
      ↓
[API Gateway] ← Fastify
      ↓
[Authentication Middleware] ← JWT validation
      ↓
[Rate Limiting] ← Redis
      ↓
[Validation] ← Zod schemas
      ↓
[Business Logic Services]
      ↓
[Database] ← Drizzle ORM
```

## Rationale

### Why REST?

**Pros:**
- Industry standard, well-understood
- Excellent tooling (OpenAPI, Postman, etc.)
- Stateless, cacheable, scalable
- Works well with offline-first (queue requests)
- HTTP semantics clear (GET, POST, PATCH, DELETE)

**Cons:**
- Not ideal for real-time updates (requires polling)
- Overfetching/underfetching without GraphQL
- Multiple round trips for complex data

**Verdict:** REST is the right foundation. GraphQL adds complexity we don't need yet. REST with smart resource design (`?include=sectors,equipment`) handles most use cases.

### Why WebSockets for Real-Time?

**Alternatives Considered:**

1. **Server-Sent Events (SSE)**
   - Pro: Simple, one-way streaming
   - Con: One-directional only (server → client)
   - Con: Limited mobile support
   - **Rejected:** Need bidirectional (sync events from mobile)

2. **Long Polling**
   - Pro: Works everywhere
   - Con: Inefficient (constant reconnections)
   - Con: High server load
   - **Rejected:** Not scalable for real-time field updates

3. **WebSockets**
   - Pro: Bidirectional, efficient
   - Pro: Low latency
   - Pro: Excellent mobile support
   - Con: Stateful (requires sticky sessions or Redis pub/sub)
   - **Accepted:** Best fit for real-time + sync

**Use Cases for WebSockets:**
- Real-time dashboard updates (crew installs radio → dashboard shows it instantly)
- Sync coordination (device pushes events, server pushes resolution)
- Notifications (work order assigned → mobile notification)
- Presence (who's currently on a site)

### Why Fastify over Express?

**Express:**
- Pros: Most popular, huge ecosystem, simple
- Cons: Slow, no schema validation, aging architecture

**Fastify:**
- Pros: 2x faster than Express, schema-based validation, TypeScript-first, plugin architecture
- Cons: Smaller ecosystem (but sufficient for our needs)

**Verdict:** Fastify's performance and schema-based validation align perfectly with TowerOS requirements.

### Why OpenAPI 3.1?

**OpenAPI Benefits:**
1. **Auto-generated documentation** - Interactive API explorer
2. **Code generation** - TypeScript clients from spec
3. **Validation** - Schema validation for free
4. **Mocking** - Mock servers for frontend development
5. **Testing** - Contract testing against spec
6. **Standards-based** - Industry standard

### Why JWT for Authentication?

**Session Cookies:**
- Pro: Simple, automatic CSRF protection
- Con: Doesn't work well with mobile apps
- Con: Requires sticky sessions or Redis

**JWT:**
- Pro: Stateless (claims in token)
- Pro: Works perfectly with mobile
- Pro: Can be validated without database hit
- Con: Can't revoke easily (mitigated with short expiry + refresh tokens)

**Our Approach:**
- **Access tokens:** Short-lived (15 min), JWT
- **Refresh tokens:** Long-lived (7 days), stored in database, can be revoked
- **Device-based:** One refresh token per device

## Implementation Details

### REST Endpoint Design

**Resource-based URLs:**
```
GET    /api/v1/sites              # List sites
POST   /api/v1/sites              # Create site
GET    /api/v1/sites/:id          # Get site
PATCH  /api/v1/sites/:id          # Update site
DELETE /api/v1/sites/:id          # Delete site
GET    /api/v1/sites/:id/timeline # Site event timeline
```

**Nested resources:**
```
GET    /api/v1/work-orders/:id/tasks
POST   /api/v1/work-orders/:id/tasks
PATCH  /api/v1/tasks/:id
```

**Actions as endpoints (not verbs):**
```
POST   /api/v1/equipment/:id/test      # Record test result
POST   /api/v1/work-orders/:id/assign  # Assign work order
POST   /api/v1/photos/upload            # Upload photo
```

### Request/Response Format

**Success (200):**
```json
{
  "data": { ... }
}
```

**Success with pagination (200):**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 245,
    "hasNext": true
  }
}
```

**Error (4xx/5xx):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid site data",
    "details": [
      { "field": "latitude", "message": "Must be between -90 and 90" }
    ],
    "requestId": "req_abc123"
  }
}
```

### Validation with Zod

```typescript
import { z } from 'zod'

const createSiteSchema = z.object({
  name: z.string().min(1).max(255),
  carrier: z.enum(['ATT', 'VERIZON', 'TMOBILE']),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  // ...
})

// Fastify route
fastify.post('/sites', {
  schema: {
    body: createSiteSchema,
  },
  handler: async (request, reply) => {
    // request.body is typed and validated
    const site = await createSite(request.body)
    return reply.code(201).send({ data: site })
  },
})
```

### Authentication Flow

```typescript
// 1. User logs in
POST /api/v1/auth/login
{
  "email": "tech@abc.com",
  "password": "...",
  "deviceId": "device_123"
}

// 2. Server returns tokens
{
  "user": { ... },
  "tokens": {
    "accessToken": "eyJhbGc...",  // 15 min expiry
    "refreshToken": "rt_abc...",   // 7 day expiry
    "expiresIn": 900
  }
}

// 3. Client includes access token in requests
GET /api/v1/sites
Authorization: Bearer eyJhbGc...

// 4. Access token expires, client refreshes
POST /api/v1/auth/refresh
{
  "refreshToken": "rt_abc..."
}

// 5. Server returns new access token
{
  "accessToken": "eyJhbGc...",
  "expiresIn": 900
}
```

### WebSocket Protocol

```typescript
// Connect
const ws = new WebSocket('wss://api.toweros.com/ws')

// Authenticate
ws.send(JSON.stringify({
  type: 'AUTH',
  token: accessToken
}))

// Subscribe to channels
ws.send(JSON.stringify({
  type: 'SUBSCRIBE',
  channels: ['site:site_123', 'workOrder:wo_456']
}))

// Receive real-time events
ws.onmessage = (event) => {
  const { type, channel, data } = JSON.parse(event.data)

  switch (type) {
    case 'EQUIPMENT_INSTALLED':
      // Update UI with new equipment
      break
    case 'TASK_COMPLETED':
      // Update work order progress
      break
  }
}
```

### Offline Sync Endpoints

```typescript
// Push events from offline device
POST /api/v1/sync/push
{
  "deviceId": "device_123",
  "events": [
    {
      "id": "evt_local_1",
      "type": "EQUIPMENT_INSTALLED",
      "timestamp": 1722604800000,
      "payload": { ... }
    }
  ]
}

// Server reconciles and returns conflicts
{
  "synced": [
    { "localId": "evt_local_1", "serverId": "evt_123" }
  ],
  "conflicts": [],
  "failed": []
}

// Pull updates since last sync
GET /api/v1/sync/pull?deviceId=device_123&since=1722604800000
{
  "events": [ ... ],
  "deletions": [ ... ],
  "lastSyncTimestamp": 1722605000000
}
```

## Performance Optimizations

### 1. Query Optimization

**Include related resources:**
```
GET /api/v1/sites/site_123?include=sectors,equipment
```

Returns site with sectors and equipment in a single request (fewer round trips).

**Field selection:**
```
GET /api/v1/sites?fields=id,name,status
```

Returns only requested fields (less bandwidth).

### 2. Caching

- **ETags** for conditional requests (304 Not Modified)
- **Redis cache** for frequently accessed data
- **CDN** for media files

### 3. Rate Limiting

- **Per-user limits** (100 req/min authenticated)
- **Per-endpoint limits** (photo upload: 10/min)
- **Redis-backed** (distributed rate limiting)

### 4. Connection Pooling

- **Database pool** (10-20 connections)
- **Redis pool** (5-10 connections)

## Security

### 1. Authentication
- JWT with RS256 (asymmetric keys)
- Refresh token rotation
- Device-based sessions

### 2. Authorization
- Role-based access control (RBAC)
- Company-level isolation (RLS)
- Resource-level permissions

### 3. Input Validation
- Zod schemas for all inputs
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitize outputs)

### 4. Rate Limiting
- Prevent brute force attacks
- DDoS protection

### 5. HTTPS Only
- TLS 1.3
- HSTS headers
- Certificate pinning (mobile)

## Monitoring

### 1. Logging
- Structured JSON logs (Pino)
- Request ID tracking
- Error logging with stack traces

### 2. Metrics
- Request latency (p50, p95, p99)
- Error rates
- Active connections (WebSocket)

### 3. Alerting
- High error rates
- Slow queries
- Service unavailability

## Consequences

### Positive

✅ **Standard REST** - Easy for third parties to integrate
✅ **Real-time capable** - WebSockets for live updates
✅ **Type-safe** - OpenAPI + Zod + TypeScript
✅ **Self-documenting** - Interactive API docs
✅ **Scalable** - Stateless REST, Redis-backed WebSockets
✅ **Offline-friendly** - Sync endpoints designed for it

### Negative

❌ **Complexity** - REST + WebSocket adds surface area
❌ **Versioning** - Breaking changes require new API version
❌ **WebSocket scaling** - Requires Redis pub/sub for multi-server

### Mitigations

- **Comprehensive tests** - Contract testing against OpenAPI spec
- **Semantic versioning** - Clear upgrade paths
- **Redis pub/sub** - WebSocket scaling solved

## Alternatives Considered

### 1. GraphQL
**Rejected:** Added complexity for minimal benefit. REST with smart includes handles our use cases. GraphQL makes sense if we had 50+ resources and complex nested queries.

### 2. gRPC
**Rejected:** Excellent performance, but poor browser support. Not suitable for web dashboard.

### 3. tRPC
**Rejected:** TypeScript-only. We need OpenAPI for third-party integrations.

## References

- [OpenAPI Specification](https://swagger.io/specification/)
- [Fastify Documentation](https://www.fastify.io/)
- [Zod Documentation](https://zod.dev/)
- [RFC 7519 - JWT](https://tools.ietf.org/html/rfc7519)
- [WebSocket Protocol - RFC 6455](https://tools.ietf.org/html/rfc6455)

## Review Date

2027-02-02 (6 months) - Evaluate API performance and consider GraphQL if query complexity increases significantly

---

**This API design provides a production-ready, scalable foundation for TowerOS that balances REST simplicity with real-time WebSocket capabilities.**
