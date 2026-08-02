# TowerOS Setup Guide

Complete guide to setting up TowerOS for local development.

## Prerequisites

Before starting, ensure you have:

- **Node.js 20+** - [Download](https://nodejs.org/)
- **pnpm 8+** - Install with `npm install -g pnpm` or `corepack enable`
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download](https://git-scm.com/)

Optional:
- **PostgreSQL 16+** - If not using Docker
- **Redis 7+** - If not using Docker

## Quick Start (5 minutes)

```bash
# 1. Clone repository
git clone <repository-url>
cd tower

# 2. Install dependencies
pnpm install

# 3. Start Docker services
docker-compose up -d

# 4. Set up environment
chmod +x scripts/*.sh
bash scripts/setup-env.sh

# 5. Run database migrations
cd packages/database
pnpm migrate
pnpm seed

# 6. Start development servers
# Terminal 1: API
cd apps/api
pnpm dev

# Terminal 2: Web
cd apps/web
pnpm dev

# Terminal 3: Mobile (optional)
cd apps/mobile
pnpm start
```

**Done!** Access:
- API: http://localhost:3000
- Web: http://localhost:3001
- Mobile: Scan QR code in Expo Go

## Detailed Setup

### Step 1: Install Dependencies

```bash
# Install all workspace dependencies
pnpm install

# Verify installation
pnpm --version  # Should be 8.0+
node --version  # Should be 20.0+
```

### Step 2: Start Docker Services

```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Verify services are running
docker ps

# Check logs
docker-compose logs -f postgres
```

**Services started:**
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- pgAdmin: `localhost:5050`

**pgAdmin credentials:**
- Email: `admin@toweros.local`
- Password: `admin`

### Step 3: Generate JWT Keys

```bash
# Generate RSA key pair for JWT signing
bash scripts/generate-jwt-keys.sh

# Keys saved to:
# - keys/jwt-private.pem (keep secret!)
# - keys/jwt-public.pem (can be public)
```

**Security:**
- Private key signs tokens
- Public key verifies tokens
- **NEVER** commit private key to git
- Rotate keys periodically in production

### Step 4: Configure Environment

#### Option A: Automatic Setup (Recommended)

```bash
bash scripts/setup-env.sh
```

This creates:
- `apps/api/.env` - API server config
- `apps/web/.env.local` - Web dashboard config
- `apps/mobile/.env` - Mobile app config
- `packages/database/.env` - Database config

#### Option B: Manual Setup

**apps/api/.env:**
```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/toweros_dev
REDIS_URL=redis://localhost:6379

JWT_PRIVATE_KEY="$(cat keys/jwt-private.pem)"
JWT_PUBLIC_KEY="$(cat keys/jwt-public.pem)"
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=30d

BCRYPT_ROUNDS=12
RATE_LIMIT_MAX=100
CORS_ORIGIN=http://localhost:3001,http://localhost:19006
```

**apps/web/.env.local:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:3000
```

**apps/mobile/.env:**
```bash
API_URL=http://localhost:3000/api/v1
```

### Step 5: Initialize Database

```bash
cd packages/database

# Generate migration files from schema
pnpm generate

# Apply migrations to database
pnpm migrate

# Seed with demo data
pnpm seed
```

**What was created:**
- 18 database tables
- 5 demo users (see credentials below)
- 4 demo sites
- 4 demo equipment items
- 3 demo work orders
- Sample tasks and events

**Demo credentials:**
```
Admin:      admin@acme-telecom.com / password
Manager:    manager@acme-telecom.com / password
Technician: tech1@acme-telecom.com / password
Viewer:     viewer@acme-telecom.com / password
```

### Step 6: Start Development Servers

#### API Server

```bash
cd apps/api
pnpm dev

# API running at http://localhost:3000
# Health check: http://localhost:3000/health
```

#### Web Dashboard

```bash
cd apps/web
pnpm dev

# Web running at http://localhost:3001
# Login with demo credentials
```

#### Mobile App (Optional)

```bash
cd apps/mobile
pnpm start

# Scan QR code with Expo Go app
# Or press 'i' for iOS simulator
# Or press 'a' for Android emulator
```

## Verification

### Test API

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

# List sites (requires auth token)
curl http://localhost:3000/api/v1/sites \
  -H "Authorization: Bearer <access_token>"
```

### Test Web Dashboard

1. Open http://localhost:3001
2. Login with `admin@acme-telecom.com` / `password`
3. View dashboard with stats
4. Browse sites list
5. View site details

### Test Mobile App

1. Scan QR code in Expo Go
2. Login with demo credentials
3. Navigate through tabs
4. Pull to refresh sites list

## Database Management

### View Database

```bash
# Open Drizzle Studio (visual database editor)
cd packages/database
pnpm studio

# Opens at http://localhost:4983
```

Or use pgAdmin at http://localhost:5050

**Connection details:**
- Host: `postgres` (or `localhost` if connecting from host)
- Port: `5432`
- Database: `toweros_dev`
- Username: `postgres`
- Password: `postgres`

### Reset Database

```bash
cd packages/database

# WARNING: Deletes ALL data!
pnpm reset

# Then re-run migrations and seed
pnpm migrate
pnpm seed
```

### Create Migration

```bash
cd packages/database

# 1. Modify schema files in src/schema/
# 2. Generate migration
pnpm generate

# 3. Review migration in migrations/
# 4. Apply migration
pnpm migrate
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port
lsof -ti:3000 | xargs kill  # API
lsof -ti:3001 | xargs kill  # Web
lsof -ti:5432 | xargs kill  # PostgreSQL

# Or change ports in .env files
```

### Database Connection Failed

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres

# Verify connection
psql postgresql://postgres:postgres@localhost:5432/toweros_dev
```

### Migration Failed

```bash
# Check current database state
cd packages/database
pnpm studio

# Reset and retry
pnpm reset
pnpm migrate

# If still failing, check migration files in migrations/
```

### JWT Keys Invalid

```bash
# Regenerate keys
rm -rf keys/
bash scripts/generate-jwt-keys.sh

# Update .env files
bash scripts/setup-env.sh

# Restart API server
```

### Node Modules Issues

```bash
# Clean install
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm install

# Clear Next.js cache
rm -rf apps/web/.next

# Clear Expo cache
cd apps/mobile
pnpm start -c
```

### "Cannot find module" Errors

```bash
# Rebuild packages
pnpm build

# Or build specific package
cd packages/ui
pnpm build
```

## Development Workflow

### Making Changes

1. **Database Schema:**
   - Edit `packages/database/src/schema/*.ts`
   - Run `pnpm generate` to create migration
   - Run `pnpm migrate` to apply
   - Update seed data if needed

2. **API Endpoints:**
   - Create route in `apps/api/src/routes/`
   - Add to route registration
   - Test with curl or Postman

3. **UI Components:**
   - Add to `packages/ui/src/web/` or `packages/ui/src/native/`
   - Export from `index.ts`
   - Use in apps

4. **Web Pages:**
   - Create in `apps/web/src/app/`
   - File-based routing (Next.js App Router)
   - Import UI components

5. **Mobile Screens:**
   - Create in `apps/mobile/app/`
   - File-based routing (Expo Router)
   - Import native UI components

### Running Tests

```bash
# Type check all packages
pnpm type-check

# Lint all packages
pnpm lint

# Fix linting issues
pnpm lint --fix

# Build all packages
pnpm build
```

### Viewing Logs

```bash
# API logs
cd apps/api
pnpm dev  # Shows Pino logs

# Web logs
cd apps/web
pnpm dev  # Shows Next.js logs

# Database logs
docker-compose logs -f postgres

# All Docker logs
docker-compose logs -f
```

## Production Setup

### Environment Variables

**apps/api/.env:**
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=<production-database-url>
REDIS_URL=<production-redis-url>

JWT_PRIVATE_KEY="<secure-private-key>"
JWT_PUBLIC_KEY="<public-key>"

BCRYPT_ROUNDS=12
RATE_LIMIT_MAX=100
CORS_ORIGIN=https://app.toweros.com
```

### Build for Production

```bash
# API
cd apps/api
pnpm build
pnpm start

# Web
cd apps/web
pnpm build
pnpm start

# Mobile
cd apps/mobile
eas build --platform all
```

### Database Migrations

```bash
# Run migrations in production
cd packages/database
NODE_ENV=production pnpm migrate

# DO NOT seed in production!
```

## Additional Tools

### Drizzle Studio

Visual database editor:

```bash
cd packages/database
pnpm studio
# Opens at http://localhost:4983
```

### pgAdmin

Database administration:

1. Open http://localhost:5050
2. Login with `admin@toweros.local` / `admin`
3. Add server:
   - Name: `TowerOS Dev`
   - Host: `postgres` (Docker) or `localhost` (local)
   - Port: `5432`
   - Database: `toweros_dev`
   - Username: `postgres`
   - Password: `postgres`

### Postman Collection

Import API collection for testing (coming soon).

## Getting Help

- **Documentation:** See `docs/` directory
- **API Docs:** http://localhost:3000/api/v1/docs (coming soon)
- **Database Schema:** `packages/database/README.md`
- **UI Components:** `packages/ui/README.md`

## Next Steps

After setup, you can:

1. **Explore the Dashboard:**
   - Login to web at http://localhost:3001
   - View sites, equipment, work orders
   - Create new records

2. **Test the Mobile App:**
   - Login with demo credentials
   - Browse sites and work orders
   - Test offline capabilities (coming soon)

3. **Develop New Features:**
   - Add new API endpoints
   - Create new UI components
   - Build new screens

4. **Read the Docs:**
   - `docs/ARCHITECTURE.md` - System architecture
   - `docs/DATABASE_DESIGN.md` - Database schema
   - `IMPLEMENTATION_COMPLETE.md` - What's built

## License

Private - TowerOS Internal Use Only
