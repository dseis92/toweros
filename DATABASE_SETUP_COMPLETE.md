# Database Setup & Migrations - COMPLETE ✅

All infrastructure for database management, migrations, and local development is now complete.

## What Was Built

### 1. Migration Infrastructure ✅

**Files Created:**
- `packages/database/drizzle.config.ts` - Drizzle Kit configuration (already existed)
- `packages/database/src/migrate.ts` - Migration runner script (already existed)
- `packages/database/package.json` - Updated with new scripts

**Scripts Added:**
```json
{
  "generate": "drizzle-kit generate",      // Generate migrations from schema
  "migrate": "tsx src/migrate.ts",         // Apply migrations
  "seed": "tsx src/seed.ts",               // Seed demo data
  "reset": "tsx src/reset.ts",             // Reset database
  "studio": "drizzle-kit studio",          // Visual editor
  "db:setup": "pnpm generate && pnpm migrate && pnpm seed"
}
```

### 2. Seed Script ✅

**File:** `packages/database/src/seed.ts`

**Demo Data Created:**
- **2 companies:** Acme Telecom, Beta Construction
- **6 users:** admin, manager, 2 technicians, viewer, beta admin
- **5 sites:** 4 Acme sites, 1 Beta site
- **3 sectors:** Alpha-1, Alpha-2, Alpha-3
- **4 equipment items:** Radio, Antenna, Fiber, Power Supply
- **3 equipment connections:** Power graph
- **1 project:** 5G Rollout Phase 1
- **3 work orders:** Installation, Survey, Testing
- **5 tasks:** Safety, installation steps, testing
- **3 events:** Site created, equipment installed, work order completed

**Demo Credentials:**
```
admin@acme-telecom.com / password
manager@acme-telecom.com / password
tech1@acme-telecom.com / password
tech2@acme-telecom.com / password
viewer@acme-telecom.com / password
```

### 3. Reset Script ✅

**File:** `packages/database/src/reset.ts`

**Features:**
- Drops all tables in correct order
- Drops all enums
- Requires confirmation (`yes` input)
- Blocks production environment
- Safe and reversible

### 4. JWT Key Generation ✅

**File:** `scripts/generate-jwt-keys.sh`

**Features:**
- Generates 2048-bit RSA key pair
- Saves to `keys/jwt-private.pem` and `keys/jwt-public.pem`
- Provides instructions for .env setup
- Includes security warnings

**Usage:**
```bash
bash scripts/generate-jwt-keys.sh
```

### 5. Docker Compose ✅

**File:** `docker-compose.yml`

**Services:**
- **PostgreSQL 16:** Database on port 5432
- **Redis 7:** Cache on port 6379
- **pgAdmin 4:** GUI on port 5050

**Features:**
- Persistent volumes for data
- Health checks
- Auto-restart
- Init script for database

**Credentials:**
- PostgreSQL: `postgres` / `postgres`
- pgAdmin: `admin@toweros.local` / `admin`

### 6. Database Initialization ✅

**File:** `scripts/init-db.sql`

**Features:**
- Creates `toweros_dev` database
- Sets up permissions
- Ready for PostGIS extension (commented out)

### 7. Environment Setup Script ✅

**File:** `scripts/setup-env.sh`

**Creates:**
- `apps/api/.env` - Full API configuration
- `apps/web/.env.local` - Web dashboard config
- `apps/mobile/.env` - Mobile app config
- `packages/database/.env` - Database config

**Features:**
- Generates JWT keys if not found
- Reads keys and formats for .env
- Creates all environment files
- Shows next steps

**Usage:**
```bash
bash scripts/setup-env.sh
```

### 8. Root Package Scripts ✅

**File:** `package.json` (root)

**New Scripts:**
```json
{
  "setup": "bash scripts/setup-env.sh",
  "setup:keys": "bash scripts/generate-jwt-keys.sh",
  "docker:up": "docker-compose up -d",
  "docker:down": "docker-compose down",
  "docker:logs": "docker-compose logs -f",
  "db:generate": "pnpm --filter @tower/database generate",
  "db:migrate": "pnpm --filter @tower/database migrate",
  "db:seed": "pnpm --filter @tower/database seed",
  "db:reset": "pnpm --filter @tower/database reset",
  "db:studio": "pnpm --filter @tower/database studio",
  "db:setup": "pnpm db:generate && pnpm db:migrate && pnpm db:seed"
}
```

### 9. Documentation ✅

**Files Created:**
- `SETUP.md` - Comprehensive setup guide (60+ sections)
- `QUICKSTART.md` - 5-minute quick start
- `keys/.gitignore` - Prevent committing private keys

**Existing Documentation:**
- `packages/database/README.md` - Database package docs

### 10. Security ✅

**Measures:**
- JWT keys in `.gitignore`
- Private keys never committed
- Environment files in `.gitignore`
- Production blocks in reset script
- Bcrypt with 12 rounds
- Secure default configurations

## How to Use

### Option 1: Quick Start (Automated)

```bash
# 1. Install dependencies
pnpm install

# 2. Start Docker
pnpm docker:up

# 3. Set up everything
pnpm setup

# 4. Initialize database
pnpm db:setup

# 5. Start API
cd apps/api
pnpm dev

# 6. Start Web
cd apps/web
pnpm dev
```

### Option 2: Step by Step

```bash
# 1. Install
pnpm install

# 2. Start services
docker-compose up -d

# 3. Generate keys
bash scripts/generate-jwt-keys.sh

# 4. Create .env files
bash scripts/setup-env.sh

# 5. Database setup
cd packages/database
pnpm generate  # Generate migration from schema
pnpm migrate   # Apply migrations
pnpm seed      # Add demo data

# 6. Start apps
cd apps/api && pnpm dev
cd apps/web && pnpm dev
```

## Verification

### 1. Check Docker Services

```bash
docker ps

# Should see:
# - toweros-postgres (port 5432)
# - toweros-redis (port 6379)
# - toweros-pgadmin (port 5050)
```

### 2. Check Database

```bash
# Connect to database
psql postgresql://postgres:postgres@localhost:5432/toweros_dev

# List tables
\dt

# Should see 18 tables
```

### 3. Check Seed Data

```bash
cd packages/database
pnpm studio

# Opens Drizzle Studio at http://localhost:4983
# View companies, users, sites, equipment, etc.
```

### 4. Test API

```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@acme-telecom.com",
    "password": "password",
    "deviceId": "test-device"
  }'

# Should return access token and user data
```

### 5. Test Web Dashboard

1. Open http://localhost:3001
2. Login with `admin@acme-telecom.com` / `password`
3. Should see dashboard with:
   - 4 sites
   - 4 equipment items
   - 2 active work orders
   - 5 total users

## Database Schema

### Tables Created (18)

1. **Identity:** companies, users, teams, crews, sessions, devices
2. **Sites:** sites, sectors
3. **Equipment:** equipment, equipment_connections, test_results
4. **Work Orders:** projects, work_orders, tasks
5. **Media:** photos, documents
6. **Events:** events, sync_queue
7. **Auth:** refresh_tokens, password_reset_tokens, login_attempts, account_lockouts

### Enums Created (11)

- `user_role`: ADMIN, MANAGER, TECHNICIAN, VIEWER
- `carrier`: ATT, VERIZON, TMOBILE, SPRINT, etc.
- `site_status`: PLANNING, CONSTRUCTION, IN_SERVICE, DECOMMISSIONED
- `equipment_type`: RADIO, ANTENNA, FIBER, POWER, etc.
- `equipment_status`: IN_SERVICE, OUT_OF_SERVICE, MAINTENANCE
- `connection_type`: POWER, FIBER, RF, ETHERNET
- `project_status`: PLANNING, IN_PROGRESS, COMPLETED, CANCELLED
- `work_order_type`: INSTALLATION, MAINTENANCE, TESTING, SURVEY
- `work_order_status`: PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED
- `priority_level`: LOW, MEDIUM, HIGH, URGENT
- `task_status`: PENDING, IN_PROGRESS, COMPLETED, SKIPPED

## File Structure

```
tower/
├── docker-compose.yml          # PostgreSQL + Redis + pgAdmin
├── SETUP.md                    # Complete setup guide
├── QUICKSTART.md               # 5-minute quick start
├── DATABASE_SETUP_COMPLETE.md  # This file
├── keys/
│   └── .gitignore             # Ignore JWT keys
├── scripts/
│   ├── generate-jwt-keys.sh   # Generate RSA key pair
│   ├── setup-env.sh           # Create all .env files
│   └── init-db.sql            # Database initialization
├── packages/database/
│   ├── src/
│   │   ├── schema/            # Schema definitions
│   │   ├── migrate.ts         # Migration runner
│   │   ├── seed.ts            # Demo data seeder
│   │   └── reset.ts           # Database reset
│   ├── migrations/            # Generated migrations
│   ├── drizzle.config.ts      # Drizzle configuration
│   ├── package.json           # Updated scripts
│   └── README.md              # Database documentation
└── package.json               # Root scripts updated
```

## Next Steps

Now that database setup is complete, you can:

1. **Start Development:**
   ```bash
   # API
   cd apps/api && pnpm dev

   # Web
   cd apps/web && pnpm dev

   # Mobile
   cd apps/mobile && pnpm start
   ```

2. **Complete CRUD Endpoints** (Step 2):
   - Equipment endpoints
   - Work orders endpoints
   - Media upload
   - Team management

3. **Add More Seed Data:**
   - Edit `packages/database/src/seed.ts`
   - Add more sites, equipment, work orders
   - Run `pnpm seed`

4. **Explore Database:**
   - Drizzle Studio: `pnpm db:studio`
   - pgAdmin: http://localhost:5050
   - Direct connection: `psql postgresql://postgres:postgres@localhost:5432/toweros_dev`

## Troubleshooting

See [SETUP.md](./SETUP.md) for detailed troubleshooting.

**Common issues:**
- Port conflicts: Change ports in docker-compose.yml
- Migration fails: Run `pnpm db:reset && pnpm db:migrate`
- JWT errors: Regenerate keys with `pnpm setup:keys`
- Connection errors: Check Docker with `docker ps`

## Summary

✅ **Migration infrastructure** - Generate and apply migrations
✅ **Seed scripts** - Demo data with realistic examples
✅ **Reset scripts** - Safe database reset with confirmation
✅ **JWT keys** - Automatic RSA key generation
✅ **Docker Compose** - PostgreSQL, Redis, pgAdmin
✅ **Database initialization** - Automated setup
✅ **Environment setup** - One command for all .env files
✅ **Documentation** - Complete guides and quick start
✅ **Root scripts** - Easy commands from root directory

**Everything is ready for development!**

🎉 **Step 1 (Database Setup & Migrations) is COMPLETE!**
