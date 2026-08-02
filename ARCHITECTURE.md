# TowerOS System Architecture

**Version:** 1.0
**Last Updated:** 2026-08-02
**Status:** Foundation Design

---

## Executive Summary

TowerOS is a field-first operating system for telecommunications construction. The architecture prioritizes offline capability, spatial data modeling, and field technician workflows over traditional project management patterns.

This is not a web app with a mobile view. This is a distributed system designed for intermittent connectivity in hostile field environments.

---

## Architectural Principles

### 1. Offline-First Architecture
**Decision:** All data operations must work without network connectivity.

**Rationale:**
- Technicians work 250+ feet on towers with poor/no signal
- Work cannot stop due to connectivity issues
- Data entry happens in the field, not the office

**Implementation:**
- Local-first database (SQLite/IndexedDB)
- Conflict-free replicated data types (CRDTs) for sync
- Event sourcing for complete audit trail
- Background sync with conflict resolution

### 2. Digital Twin Data Model
**Decision:** Physical infrastructure is modeled as a hierarchical graph of interconnected entities.

**Rationale:**
- Technicians think spatially, not in folders
- Equipment relationships must be preserved
- History must be immutable and complete

**Implementation:**
- Entity-Component-System (ECS) inspired architecture
- Directed acyclic graph (DAG) for site hierarchy
- Immutable event log for all changes
- Bidirectional relationships (e.g., Radio ↔ Fiber ↔ Breaker)

### 3. Mobile-First, Field-Hardened UI
**Decision:** Interface designed for one-handed operation with gloves in sunlight.

**Rationale:**
- Primary users are climbing towers
- Touchscreens must work with gloves
- Screens must be readable in direct sunlight
- Actions must be fast (3 taps or less)

**Implementation:**
- Native mobile apps (iOS/Android)
- Large touch targets (minimum 48x48dp)
- High contrast design system
- Minimal text input, maximum scanning/photos
- Gesture-based navigation

### 4. Event Sourcing & CQRS
**Decision:** All state changes are captured as immutable events.

**Rationale:**
- Complete audit trail required for compliance
- Time-travel debugging for support
- Enables "replay what happened on March 4th"
- Natural fit for offline sync

**Implementation:**
- Event store as source of truth
- Read models (projections) for queries
- Command handlers validate business rules
- Events sync between devices

### 5. Microservices with Modular Monolith Start
**Decision:** Begin as modular monolith, design for future microservices.

**Rationale:**
- Faster initial development
- Easier debugging early on
- Natural module boundaries already clear
- Can extract services as scale demands

**Implementation:**
- Domain-driven design (DDD) bounded contexts
- Clear module interfaces
- Shared kernel minimized
- Service mesh ready

---

## System Components

### Frontend Layer

#### Mobile Applications
- **Platform:** React Native with Expo
- **State Management:** Zustand + TanStack Query
- **Local Database:** WatermelonDB (SQLite wrapper)
- **Offline Sync:** Custom CRDT-based sync engine
- **Navigation:** React Navigation (spatial hierarchy aware)
- **Camera:** Expo Camera + Image manipulation
- **Maps:** MapLibre GL (offline tile support)

**Why React Native:**
- Single codebase for iOS/Android
- Native performance for critical paths
- Excellent offline-first libraries
- Large ecosystem for device features (camera, GPS, sensors)
- Expo provides professional OTA updates

**Why WatermelonDB:**
- Built for offline-first
- Lazy loading for 10,000+ records
- Optimistic updates
- React integration
- Observable queries

#### Web Dashboard
- **Platform:** Next.js 14 (App Router)
- **UI Framework:** React 18
- **State Management:** Zustand + TanStack Query
- **Styling:** Tailwind CSS + CSS Modules
- **Tables:** TanStack Table
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Maps:** MapLibre GL

**Why Next.js:**
- Server components for performance
- API routes for BFF pattern
- Excellent SEO for public site pages
- Edge runtime support
- Type-safe with TypeScript

### Backend Layer

#### API Gateway
- **Platform:** Node.js + Fastify
- **Protocol:** REST + WebSocket (real-time)
- **Authentication:** JWT + Refresh tokens
- **Rate Limiting:** Redis-backed
- **API Docs:** OpenAPI 3.1 spec

**Why Fastify:**
- Fastest Node.js framework
- Schema-based validation
- Plugin architecture
- TypeScript native
- Excellent async performance

#### Application Services

**1. Site Service**
- Manages digital twin hierarchy
- Site CRUD operations
- Equipment relationship graph
- Spatial queries

**2. Work Order Service**
- Construction workflow orchestration
- Task assignment
- Progress tracking
- Punch list management

**3. Media Service**
- Photo upload/storage
- Drawing management
- PDF generation
- Image optimization

**4. Sync Service**
- Offline event reconciliation
- Conflict resolution (last-write-wins with vector clocks)
- Device state management
- Background job processing

**5. Analytics Service**
- Site history timelines
- Equipment performance metrics
- Crew productivity
- Compliance reporting

**6. AI Service**
- RAG (Retrieval Augmented Generation)
- Equipment manuals embeddings
- Natural language site queries
- Anomaly detection

**7. User Service**
- Authentication
- Authorization (RBAC)
- User profiles
- Company/crew management

### Data Layer

#### Primary Database
- **Technology:** PostgreSQL 16
- **Extensions:** PostGIS (spatial), pgvector (AI embeddings), TimescaleDB (time-series)
- **ORM:** Drizzle ORM (type-safe, lightweight)
- **Migrations:** Drizzle Kit
- **Connection Pooling:** PgBouncer

**Why PostgreSQL:**
- Industry standard reliability
- JSONB for flexible equipment metadata
- PostGIS for tower locations, coverage maps
- Excellent full-text search
- Row-level security for multi-tenancy
- ACID compliance critical for construction compliance

#### Event Store
- **Technology:** PostgreSQL (separate database)
- **Pattern:** Append-only event log
- **Retention:** Indefinite (compliance requirement)
- **Projections:** Materialized views

**Why PostgreSQL for Events:**
- Don't need specialized event store yet
- Simpler operations (one database technology)
- Can use EventStoreDB later if needed
- ACID guarantees

#### Cache Layer
- **Technology:** Redis 7
- **Use Cases:**
  - Session storage
  - Rate limiting
  - Real-time pub/sub
  - Background job queues (BullMQ)
  - Computed projection cache

#### Object Storage
- **Technology:** S3-compatible (AWS S3 / Cloudflare R2)
- **Use Cases:**
  - Construction photos (original + thumbnails)
  - PDF drawings
  - Equipment manuals
  - Site closeout packages
- **CDN:** CloudFront / Cloudflare CDN

#### Vector Database
- **Technology:** pgvector (PostgreSQL extension)
- **Use Cases:**
  - Equipment manual embeddings
  - Semantic search
  - AI-assisted troubleshooting

### Infrastructure Layer

#### Container Orchestration
- **Development:** Docker Compose
- **Production:** Kubernetes (EKS/GKE) or Railway/Render (start simple)

#### CI/CD
- **Platform:** GitHub Actions
- **Testing:** Jest + Playwright
- **Coverage:** Required 80%+
- **Linting:** ESLint + Prettier + TypeScript strict

#### Observability
- **Logging:** Structured JSON logs (Pino)
- **Tracing:** OpenTelemetry
- **Metrics:** Prometheus + Grafana
- **Error Tracking:** Sentry
- **Uptime:** Better Uptime

#### Security
- **Secrets:** Environment variables + Vault (production)
- **TLS:** Automated via Let's Encrypt
- **WAF:** Cloudflare
- **DDoS Protection:** Cloudflare
- **Dependency Scanning:** Snyk

---

## Data Flow Architecture

### Write Path (Technician Installing Equipment)

```
Mobile App
  ↓
[Local SQLite] ← Immediate write (optimistic)
  ↓
[Event Generated] → {type: "RADIO_INSTALLED", payload: {...}, timestamp, deviceId}
  ↓
[Background Sync Queue]
  ↓ (when connected)
WebSocket → API Gateway
  ↓
[Auth Middleware]
  ↓
[Command Handler] → Validates business rules
  ↓
[Event Store] → Append to log
  ↓
[Event Processor] → Update read models
  ↓
[PostgreSQL] → Update projections
  ↓
[Cache Invalidation] → Redis
  ↓
[WebSocket Broadcast] → Notify other devices
```

### Read Path (Manager Viewing Dashboard)

```
Web Dashboard
  ↓
[TanStack Query] → API request
  ↓
API Gateway → [Auth Middleware]
  ↓
[Read Model Service]
  ↓
[Redis Cache] → Check cache
  ↓ (if miss)
[PostgreSQL] → Query projection
  ↓
[Cache Write] → Update Redis
  ↓
Response → Web Dashboard
```

### Sync Conflict Resolution

```
Device A: Updated radio serial at 10:00 AM
Device B: Updated same radio serial at 10:05 AM (offline)

Both devices sync:
  ↓
[Sync Service Detects Conflict]
  ↓
[Vector Clock Comparison]
  ↓
[Last Write Wins] → Device B timestamp newer
  ↓
[Event Log Records Both Events]
  ↓
[Projection Uses Latest]
  ↓
[Device A Receives Sync Event] → Local state updated
```

---

## Module Organization (Monorepo)

```
tower/
├── apps/
│   ├── mobile/          # React Native app
│   ├── web/             # Next.js dashboard
│   └── api/             # Fastify API gateway
├── packages/
│   ├── database/        # Drizzle schema + migrations
│   ├── shared/          # Shared types, utils
│   ├── sync-engine/     # Offline sync logic
│   ├── ui/              # Shared component library
│   ├── validators/      # Zod schemas
│   └── ai/              # AI/RAG service
├── services/
│   ├── site/
│   ├── work-order/
│   ├── media/
│   ├── sync/
│   ├── analytics/
│   └── user/
├── docs/
│   ├── architecture/
│   ├── api/
│   └── adr/            # Architectural Decision Records
└── infrastructure/
    ├── docker/
    ├── kubernetes/
    └── terraform/
```

**Technology:** Turborepo (monorepo build system)

**Why Monorepo:**
- Shared types across mobile/web/API
- Atomic changes across layers
- Simplified versioning
- Easier refactoring

---

## Scalability Considerations

### Phase 1: MVP (0-100 sites, 0-500 users)
- Single PostgreSQL instance
- Single Redis instance
- Horizontal API scaling (3-5 containers)
- S3 for media
- Regional deployment (US-only)

**Estimated Capacity:**
- 1000 requests/second
- 100GB database
- 10TB media storage

### Phase 2: Growth (100-10,000 sites, 500-5,000 users)
- PostgreSQL read replicas
- Redis cluster
- Horizontal API scaling (10-20 containers)
- CDN for media
- Multi-region deployment

**Estimated Capacity:**
- 10,000 requests/second
- 1TB database
- 100TB media storage

### Phase 3: Enterprise (10,000+ sites, 5,000+ users)
- PostgreSQL sharding (by company)
- Dedicated event store (EventStoreDB)
- Microservices extraction
- Global CDN
- Edge computing for sync

**Estimated Capacity:**
- 100,000+ requests/second
- 10TB+ database
- Petabyte-scale media

---

## Security Architecture

### Authentication
- **Strategy:** JWT access tokens (15 min) + Refresh tokens (7 days)
- **Storage:**
  - Mobile: Secure storage (Keychain/Keystore)
  - Web: HttpOnly cookies
- **MFA:** TOTP (optional, recommended for admins)

### Authorization
- **Model:** Role-Based Access Control (RBAC)
- **Roles:**
  - Super Admin (platform)
  - Company Admin
  - Project Manager
  - Foreman
  - Technician
  - Inspector (read-only)
  - Client (read-only, limited)

### Data Isolation
- **Strategy:** Row-Level Security (RLS) in PostgreSQL
- **Scope:** Company-level isolation
- **API:** Company context from JWT
- **Database:** Automatic filtering via RLS policies

### Compliance
- **Audit Trail:** Complete via event sourcing
- **Data Retention:** Configurable per company
- **GDPR:** Right to be forgotten (mark deleted, don't purge events)
- **Encryption:**
  - At rest: Database + S3 encryption
  - In transit: TLS 1.3
  - Sensitive fields: Application-level encryption

---

## Disaster Recovery

### Backup Strategy
- **Database:** Automated daily backups (7 day retention, then weekly for 1 year)
- **Media:** S3 versioning + lifecycle policies
- **Event Store:** Continuous archival to cold storage

### Recovery Objectives
- **RTO (Recovery Time Objective):** 4 hours
- **RPO (Recovery Point Objective):** 1 hour

### High Availability
- **Database:** Multi-AZ deployment
- **API:** Auto-scaling across availability zones
- **Cache:** Redis cluster with replicas

---

## Technology Stack Summary

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Mobile | React Native + Expo | Cross-platform, native performance, offline-first ecosystem |
| Web | Next.js 14 | Server components, excellent DX, production-ready |
| API | Node.js + Fastify | Fast, TypeScript native, plugin architecture |
| Database | PostgreSQL 16 | ACID, spatial, vectors, reliability |
| Cache | Redis 7 | Industry standard, pub/sub, queues |
| Storage | S3-compatible | Scalable, CDN integration, industry standard |
| ORM | Drizzle | Type-safe, lightweight, migration system |
| Validation | Zod | Runtime + compile-time safety, great DX |
| Monorepo | Turborepo | Fast builds, caching, simple configuration |
| Deployment | Docker + K8s | Container orchestration, scalability |
| Observability | OpenTelemetry + Sentry | Distributed tracing, error tracking |

---

## Why These Choices Matter for Telecom Construction

### 1. Offline-First = Work Never Stops
Traditional SaaS apps fail when connectivity is lost. TowerOS works perfectly offline because that's the primary environment. Network connectivity is a nice-to-have, not a requirement.

### 2. Event Sourcing = Complete Compliance
When a carrier asks "what happened on this site on March 4th?", we can replay every single action. When an incident occurs, we have perfect forensics. When an audit happens, we have immutable proof.

### 3. Digital Twin = Spatial Intelligence
Other apps store "equipment lists". TowerOS understands that Radio 3 is powered by Breaker 7, fed by Fiber Port 12, connected to Antenna 3A, installed by Technician Mike on Crew Delta. This is how technicians actually think.

### 4. Mobile-First = Field Respect
Technicians are not office workers. The interface respects their environment: gloves, sunlight, one hand, climbing, safety gear. The app serves them, not the other way around.

### 5. PostgreSQL = Trust
This is not a hackathon project. We use battle-tested technology that will work in 10 years. PostgreSQL has run critical infrastructure for decades. It will run TowerOS for decades.

---

## Next Steps

1. ✅ Architecture defined
2. ⏳ ER diagram (detailed entity relationships)
3. ⏳ Database schema (Drizzle ORM schema)
4. ⏳ API contracts (OpenAPI specification)
5. ⏳ Folder structure (scaffold monorepo)
6. ⏳ Wireframes (core workflows)
7. ⏳ Design system
8. ⏳ UI components
9. ⏳ Authentication
10. ⏳ Module implementation

---

**This architecture is designed to last 10+ years while remaining adaptable to technological evolution.**
