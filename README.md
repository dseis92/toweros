# TowerOS

**Field Operating System for Telecommunications Construction**

> Before writing a single line of code, you must first understand the problem this software is solving.

TowerOS is **not** a project management tool, a checklist app, a CRM, or an inventory system.

TowerOS is a **Field Operating System** for the telecommunications construction industry.

Think of it as the digital nervous system for every cellular tower that exists.

---

## Vision

Every cellular site has a complete digital life—from the day it is designed until the day it is decommissioned.

Every tower is a living asset. Every asset has a history. Every technician contributes to that history.

**Nothing should ever disappear.**

Instead of managing paperwork, TowerOS manages infrastructure.

Read the complete vision: [docs/VISION.md](../VISION.md)

---

## Current Status

✅ **MVP Foundation Complete** - Ready for development

### Completed ✅

**Phase 1-3: Architecture & Data**
- [x] Complete system architecture with ADRs
- [x] Entity Relationship Diagram (18 tables, 6 domains)
- [x] Database schema with Drizzle ORM
- [x] Migration system with seed data

**Phase 4-5: API & Structure**
- [x] OpenAPI 3.1 specification
- [x] Monorepo structure with Turborepo
- [x] Shared packages (database, validators, ui, auth)

**Phase 6-7: Design**
- [x] Wireframes for 8 core workflows
- [x] Complete design system with tokens
- [x] User flows with Mermaid diagrams

**Phase 8: UI Components**
- [x] Component library (16 components for web + native)
- [x] Field-optimized (48px targets, high contrast)

**Phase 9: Authentication**
- [x] JWT with refresh token rotation
- [x] RBAC with permission wildcards
- [x] Account lockout protection

**Phase 10: API Server**
- [x] Fastify server with auth middleware
- [x] Sites CRUD endpoints
- [x] Rate limiting, CORS, security headers

**Phase 11: Mobile App**
- [x] React Native + Expo with file-based routing
- [x] Authentication flow
- [x] Core screens (Home, Sites, Work Orders, Profile)

**Phase 12: Web Dashboard**
- [x] Next.js 14 with App Router
- [x] Dashboard with metrics
- [x] Sites and Work Orders management

**Setup & Infrastructure**
- [x] Docker Compose (PostgreSQL, Redis, pgAdmin)
- [x] JWT key generation scripts
- [x] Environment setup automation
- [x] Database seed scripts with demo data
- [x] Comprehensive documentation

See: [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) | [DATABASE_SETUP_COMPLETE.md](./DATABASE_SETUP_COMPLETE.md)

---

## Architecture

### Core Principles

1. **Offline-First** - All operations work without network connectivity
2. **Event Sourcing** - Complete audit trail of all state changes
3. **Digital Twin** - Equipment relationships mirror physical reality
4. **Field-Hardened** - Designed for technicians on towers, not office workers
5. **Multi-Tenant** - Complete data isolation between companies

Read: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

### Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Mobile | React Native + Expo | Cross-platform, offline-first, code sharing |
| Web | Next.js 14 | Server components, performance, SEO |
| API | Node.js + Fastify | Fast, TypeScript-native, schema-based |
| Database | PostgreSQL 16 | ACID, spatial, vectors, proven reliability |
| ORM | Drizzle | Type-safe, lightweight, great migrations |
| Cache | Redis 7 | Pub/sub, queues, session storage |
| Storage | S3 | Scalable object storage for photos/docs |
| Monorepo | Turborepo | Fast builds, caching, shared packages |

---

## Database Schema

### Domains

```
┌──────────────────────────────────────────────────┐
│  IDENTITY DOMAIN                                  │
│  Companies → Users → Teams → Crews               │
├──────────────────────────────────────────────────┤
│  SITE DOMAIN (Digital Twin)                      │
│  Site → Sectors → Equipment (graph)              │
├──────────────────────────────────────────────────┤
│  EQUIPMENT DOMAIN                                │
│  Equipment + Connections + Test Results          │
├──────────────────────────────────────────────────┤
│  WORK ORDER DOMAIN                               │
│  Projects → Work Orders → Tasks                  │
├──────────────────────────────────────────────────┤
│  MEDIA DOMAIN                                    │
│  Photos + Documents (with EXIF/metadata)         │
├──────────────────────────────────────────────────┤
│  EVENTS DOMAIN (Event Sourcing)                  │
│  Immutable audit log + Sync queue                │
└──────────────────────────────────────────────────┘
```

See: [docs/DATABASE_DESIGN.md](docs/DATABASE_DESIGN.md) | [docs/ER_DIAGRAM.md](docs/ER_DIAGRAM.md)

---

## Getting Started

### Quick Start (5 Minutes)

```bash
# 1. Install dependencies
pnpm install

# 2. Start Docker services (PostgreSQL + Redis)
pnpm docker:up

# 3. Set up environment (creates all .env files + JWT keys)
pnpm setup

# 4. Initialize database (generate + migrate + seed)
pnpm db:setup

# 5. Start development servers
# Terminal 1: API
cd apps/api && pnpm dev

# Terminal 2: Web
cd apps/web && pnpm dev

# Terminal 3: Mobile (optional)
cd apps/mobile && pnpm start
```

**Done!** Access at:
- API: http://localhost:3000
- Web: http://localhost:3001 (login: admin@acme-telecom.com / password)
- Mobile: Scan QR code in Expo Go

See [QUICKSTART.md](./QUICKSTART.md) for details or [SETUP.md](./SETUP.md) for comprehensive guide.

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker Desktop

### Database Tools

```bash
# Generate migration from schema changes
pnpm db:generate

# Apply pending migrations
pnpm db:migrate

# Seed demo data
pnpm db:seed

# Reset database (WARNING: deletes all data)
pnpm db:reset

# Visual database editor
pnpm db:studio

# Complete setup (generate + migrate + seed)
pnpm db:setup
```

---

## Project Structure

```
tower/
├── apps/
│   ├── mobile/          # React Native app (iOS/Android)
│   ├── web/             # Next.js dashboard
│   └── api/             # Fastify API gateway
├── packages/
│   ├── database/        # Drizzle schema + migrations ✅
│   ├── shared/          # Shared types, utils
│   ├── sync-engine/     # Offline sync logic
│   ├── ui/              # Shared component library
│   ├── validators/      # Zod schemas
│   └── ai/              # AI/RAG service
├── services/
│   ├── site/            # Site management service
│   ├── work-order/      # Work order orchestration
│   ├── media/           # Photo/document handling
│   ├── sync/            # Offline sync reconciliation
│   ├── analytics/       # Reporting and metrics
│   └── user/            # Authentication and users
├── docs/
│   ├── architecture/    # Architecture docs
│   ├── api/             # API documentation
│   └── adr/             # Architectural Decision Records
└── infrastructure/
    ├── docker/          # Docker configs
    ├── kubernetes/      # K8s manifests
    └── terraform/       # Infrastructure as code
```

---

## Documentation

### Architecture
- [System Architecture](docs/ARCHITECTURE.md) - Complete system design
- [Database Design](docs/DATABASE_DESIGN.md) - Entity definitions
- [ER Diagram](docs/ER_DIAGRAM.md) - Visual relationships

### ADRs (Architectural Decision Records)
- [ADR 001: Offline-First Architecture](docs/adr/001-offline-first-architecture.md)
- [ADR 002: Event Sourcing for Audit Trail](docs/adr/002-event-sourcing-for-audit-trail.md)
- [ADR 003: React Native for Mobile](docs/adr/003-react-native-for-mobile.md)

### Progress
- [Development Progress](docs/PROGRESS.md) - Current status and metrics

---

## Development Principles

### 1. Work Incrementally
Never build an entire feature at once. Build layer by layer:
1. Design the architecture
2. Define the data model
3. Implement the API
4. Build the UI
5. Test thoroughly
6. Refactor continuously

### 2. Production-Ready Patterns Only
- No placeholders
- No "TODO: Implement this later"
- No hardcoded values
- No shortcuts

### 3. Document Every Decision
Every architectural choice is captured in an ADR explaining:
- Context (why this decision is needed)
- Decision (what we chose)
- Consequences (positive and negative)
- Alternatives considered

### 4. Type Safety is Non-Negotiable
- 100% TypeScript (strict mode)
- 0 `any` types
- Full inference from database schema
- Runtime validation with Zod

### 5. Offline-First Always
- Every feature works without network
- Sync is transparent to the user
- Conflicts are resolved automatically
- Complete event log for forensics

---

## Why TowerOS is Different

### The Problem

Today, a cellular site's information is scattered across:
- PDFs
- Excel spreadsheets
- Emails
- Paper drawings
- Shared drives
- Personal notes
- Text messages
- Photo galleries
- Carrier portals

When a technician arrives at a site years later, they have **no idea**:
- Who built it
- What equipment is installed
- What has been replaced
- What has failed before
- Where cables run

### The Solution

**TowerOS creates a permanent digital twin of every site.**

Every component has:
- Complete installation history
- Photos from every angle
- Test results
- Warranty information
- Maintenance records
- Relationships to other components

Years later, a technician can ask:
- "What radio is installed on Sector Beta?"
- "When was it installed?"
- "Who installed it?"
- "Has it failed before?"
- "Show me every photo ever taken of it."

And get **instant answers**.

---

## The Digital Twin

```
Site: North Tower Alpha
└─ Sector Alpha (Azimuth: 45°)
   ├─ Antenna: Ericsson AIR 6449
   │  ├─ Installed: 2026-03-15 by Mike Johnson (Crew Delta)
   │  ├─ Serial: ABC-123-XYZ
   │  ├─ Photos: 12 photos
   │  └─ Tests: PIM passed, VSWR 1.2:1
   │
   ├─ Radio RRU
   │  ├─ Connected to: Antenna via Hybrid Cable
   │  ├─ Powered by: Breaker 1 (60A)
   │  ├─ Fed by: Fiber Port 1-4
   │  └─ RET: Motor #7
   │
   └─ Fiber Cable
      ├─ 12-strand SMF
      ├─ Length: 250ft
      ├─ Loss: 0.3dB (tested 2026-03-16)
      └─ Terminated by: Sarah Chen
```

Every object is connected. Every change is logged. Every question is answerable.

---

## For Field Technicians

### The Mobile Experience

1. **Arrive at Site**
   - GPS auto-detects location
   - Shows weather, wind, safety requirements
   - Displays today's work orders

2. **Install Equipment**
   - Scan barcode → equipment identified
   - Take photo → auto-tagged and geotagged
   - Fill checklist → one-handed with gloves
   - Everything saved **offline**

3. **Test & Document**
   - Run PIM test → results logged
   - Take "after" photo → linked to equipment
   - Mark task complete → work order updated

4. **Sync When Connected**
   - Automatic background sync
   - No user intervention needed
   - Conflicts resolved transparently

### Design for the Field

- **Large touch targets** (minimum 48x48dp)
- **High contrast** (readable in sunlight)
- **One-handed operation** (climbing with one hand)
- **Glove-friendly** (capacitive touch optimized)
- **Minimal typing** (scanning, photos, checklists)
- **Fast** (no waiting for loading screens)

---

## For Project Managers

### The Web Dashboard

- **Real-time visibility** into all active sites
- **Crew tracking** and utilization
- **Photo timelines** showing work progression
- **Automated reports** for carrier closeout
- **Analytics** on productivity and quality
- **Compliance** documentation automatically generated

---

## Safety First

Safety is integrated into every workflow:

- Daily Job Hazard Analysis
- Weather alerts (wind, lightning)
- RF awareness zones
- Rescue plans
- Certification tracking
- Emergency contacts
- Incident reporting

**Work stops if safety requirements aren't met.**

---

## Contributing

This is currently a private project in early development.

Contribution guidelines will be added once the foundation is complete.

---

## License

Proprietary - All Rights Reserved

---

## Contact

For questions about TowerOS:
- Architecture: See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Progress: See [docs/PROGRESS.md](docs/PROGRESS.md)
- Vision: See [VISION.md](VISION.md) (main vision document)

---

## Acknowledgments

TowerOS is built by people who understand telecommunications construction.

This is not built by people guessing what tower technicians need.

This is built **by** the industry, **for** the industry.

---

**TowerOS: The Operating System for Telecommunications Infrastructure**

*Building correctly. Building incrementally. Building for decades.*
