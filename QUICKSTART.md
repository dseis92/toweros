# TowerOS Quick Start

Get TowerOS running in 5 minutes.

## Prerequisites

- Node.js 20+
- pnpm 8+
- Docker Desktop

## Installation

```bash
# 1. Clone and install
git clone <repository-url>
cd tower
pnpm install

# 2. Start database
docker-compose up -d

# 3. Set up environment
chmod +x scripts/*.sh
bash scripts/setup-env.sh

# 4. Initialize database
cd packages/database
pnpm generate
pnpm migrate
pnpm seed
cd ../..

# 5. Start services
# Terminal 1: API
cd apps/api
pnpm dev

# Terminal 2: Web (in new terminal)
cd apps/web
pnpm dev
```

## Access Applications

- **API:** http://localhost:3000
- **Web Dashboard:** http://localhost:3001
- **pgAdmin:** http://localhost:5050

## Login

```
Email: admin@acme-telecom.com
Password: password
```

## Verify Setup

```bash
# Test API
curl http://localhost:3000/health

# Test login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@acme-telecom.com",
    "password": "password",
    "deviceId": "test"
  }'
```

## What's Next?

- Read [SETUP.md](./SETUP.md) for detailed documentation
- See [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) for what's built
- Check [docs/](./docs/) for architecture and design docs

## Common Issues

**Port 5432 already in use:**
```bash
docker-compose down
docker-compose up -d
```

**Migration failed:**
```bash
cd packages/database
pnpm reset
pnpm migrate
pnpm seed
```

**API won't start:**
```bash
# Check .env file exists
ls apps/api/.env

# Regenerate environment
bash scripts/setup-env.sh
```

## Development Workflow

```bash
# Add new database table
# 1. Edit packages/database/src/schema/*.ts
# 2. Generate migration
cd packages/database
pnpm generate

# 3. Apply migration
pnpm migrate

# View database
pnpm studio  # Opens at http://localhost:4983
```

## Scripts

```bash
# Root commands
pnpm setup              # Set up all .env files
pnpm setup:keys         # Generate JWT keys
pnpm docker:up          # Start Docker services
pnpm docker:down        # Stop Docker services
pnpm db:setup           # Generate + migrate + seed

# Database commands (from packages/database/)
pnpm generate           # Generate migration
pnpm migrate            # Apply migrations
pnpm seed               # Seed demo data
pnpm reset              # Reset database (WARNING!)
pnpm studio             # Open visual editor
```

## Support

- Issues: Check [SETUP.md](./SETUP.md) troubleshooting section
- Documentation: See [docs/](./docs/) directory
- Database: See [packages/database/README.md](./packages/database/README.md)
