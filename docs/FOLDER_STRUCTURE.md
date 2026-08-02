# TowerOS Folder Structure

**Complete monorepo organization**

---

## Overview

TowerOS uses a **Turborepo monorepo** with clear separation between applications, shared packages, and services.

### Principles

1. **Domain-driven** - Code organized by business domain
2. **Shared packages** - Reusable code extracted to packages
3. **Type-safe** - Shared types across all apps
4. **Independent deployment** - Each app/service can deploy separately
5. **Optimized builds** - Turborepo caching for fast builds

---

## Complete Structure

```
tower/
│
├── apps/                          # Deployable applications
│   ├── mobile/                    # React Native mobile app
│   │   ├── src/
│   │   │   ├── app/              # Expo Router (file-based routing)
│   │   │   │   ├── (auth)/       # Auth flow
│   │   │   │   │   ├── login.tsx
│   │   │   │   │   └── register.tsx
│   │   │   │   ├── (tabs)/       # Main app tabs
│   │   │   │   │   ├── sites/
│   │   │   │   │   │   ├── index.tsx
│   │   │   │   │   │   └── [id].tsx
│   │   │   │   │   ├── work-orders/
│   │   │   │   │   ├── profile/
│   │   │   │   │   └── _layout.tsx
│   │   │   │   ├── site/
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── index.tsx
│   │   │   │   │       ├── equipment.tsx
│   │   │   │   │       ├── timeline.tsx
│   │   │   │   │       └── photos.tsx
│   │   │   │   └── _layout.tsx
│   │   │   ├── components/       # UI components
│   │   │   │   ├── ui/          # Design system components
│   │   │   │   ├── site/
│   │   │   │   ├── equipment/
│   │   │   │   └── forms/
│   │   │   ├── services/        # Business logic
│   │   │   │   ├── database/    # WatermelonDB
│   │   │   │   ├── sync/
│   │   │   │   ├── api/
│   │   │   │   └── auth/
│   │   │   ├── hooks/           # React hooks
│   │   │   ├── stores/          # Zustand stores
│   │   │   ├── utils/
│   │   │   └── constants/
│   │   ├── assets/
│   │   ├── app.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                       # Next.js web dashboard
│   │   ├── src/
│   │   │   ├── app/              # App router
│   │   │   │   ├── (auth)/
│   │   │   │   ├── (dashboard)/
│   │   │   │   │   ├── sites/
│   │   │   │   │   ├── work-orders/
│   │   │   │   │   ├── equipment/
│   │   │   │   │   ├── analytics/
│   │   │   │   │   └── layout.tsx
│   │   │   │   ├── api/         # API routes (BFF pattern)
│   │   │   │   └── layout.tsx
│   │   │   ├── components/      # React components
│   │   │   │   ├── ui/
│   │   │   │   ├── site/
│   │   │   │   ├── equipment/
│   │   │   │   ├── work-orders/
│   │   │   │   └── layouts/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   └── utils/
│   │   ├── public/
│   │   ├── next.config.js
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── api/                       # Fastify API gateway
│       ├── src/
│       │   ├── routes/           # API routes
│       │   │   ├── auth/
│       │   │   ├── sites/
│       │   │   ├── equipment/
│       │   │   ├── work-orders/
│       │   │   ├── photos/
│       │   │   ├── documents/
│       │   │   └── sync/
│       │   ├── plugins/          # Fastify plugins
│       │   │   ├── auth.ts
│       │   │   ├── rate-limit.ts
│       │   │   ├── cors.ts
│       │   │   └── swagger.ts
│       │   ├── middleware/
│       │   │   ├── authenticate.ts
│       │   │   ├── authorize.ts
│       │   │   └── validate.ts
│       │   ├── services/         # Business logic
│       │   │   ├── site-service.ts
│       │   │   ├── equipment-service.ts
│       │   │   ├── work-order-service.ts
│       │   │   └── sync-service.ts
│       │   ├── utils/
│       │   ├── config.ts
│       │   ├── server.ts
│       │   └── index.ts
│       ├── test/
│       ├── package.json
│       └── tsconfig.json
│
├── packages/                      # Shared packages
│   ├── database/                  # ✅ COMPLETE
│   │   ├── src/
│   │   │   ├── schema/
│   │   │   │   ├── identity.ts
│   │   │   │   ├── sites.ts
│   │   │   │   ├── equipment.ts
│   │   │   │   ├── work-orders.ts
│   │   │   │   ├── media.ts
│   │   │   │   ├── events.ts
│   │   │   │   └── index.ts
│   │   │   ├── client.ts
│   │   │   ├── migrate.ts
│   │   │   └── index.ts
│   │   ├── migrations/
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   │
│   ├── shared/                    # Shared types and utils
│   │   ├── src/
│   │   │   ├── types/
│   │   │   │   ├── site.ts
│   │   │   │   ├── equipment.ts
│   │   │   │   ├── work-order.ts
│   │   │   │   ├── user.ts
│   │   │   │   └── index.ts
│   │   │   ├── constants/
│   │   │   │   ├── enums.ts
│   │   │   │   ├── carriers.ts
│   │   │   │   └── equipment-types.ts
│   │   │   ├── utils/
│   │   │   │   ├── date.ts
│   │   │   │   ├── format.ts
│   │   │   │   └── validation.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── validators/                # Zod schemas
│   │   ├── src/
│   │   │   ├── site.ts
│   │   │   ├── equipment.ts
│   │   │   ├── work-order.ts
│   │   │   ├── user.ts
│   │   │   ├── auth.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── ui/                        # Shared component library
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   ├── Card/
│   │   │   │   ├── Modal/
│   │   │   │   └── index.ts
│   │   │   ├── theme/
│   │   │   │   ├── colors.ts
│   │   │   │   ├── typography.ts
│   │   │   │   └── spacing.ts
│   │   │   └── index.ts
│   │   ├── .storybook/           # Storybook config
│   │   └── package.json
│   │
│   ├── sync-engine/              # Offline sync logic
│   │   ├── src/
│   │   │   ├── sync-manager.ts
│   │   │   ├── conflict-resolver.ts
│   │   │   ├── vector-clock.ts
│   │   │   ├── event-queue.ts
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── ai/                        # AI/RAG service
│       ├── src/
│       │   ├── embeddings.ts
│       │   ├── rag.ts
│       │   ├── vector-store.ts
│       │   └── index.ts
│       └── package.json
│
├── services/                      # Microservices (future extraction)
│   ├── site/
│   ├── work-order/
│   ├── media/
│   ├── sync/
│   ├── analytics/
│   └── user/
│
├── docs/                          # Documentation
│   ├── architecture/
│   ├── api/
│   │   ├── API_DESIGN.md
│   │   └── openapi.yaml
│   ├── adr/
│   │   ├── 001-offline-first-architecture.md
│   │   ├── 002-event-sourcing-for-audit-trail.md
│   │   ├── 003-react-native-for-mobile.md
│   │   └── 004-rest-api-with-websockets.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE_DESIGN.md
│   ├── ER_DIAGRAM.md
│   ├── FOLDER_STRUCTURE.md (this file)
│   └── PROGRESS.md
│
├── infrastructure/                # Infrastructure as code
│   ├── docker/
│   │   ├── Dockerfile.api
│   │   ├── Dockerfile.web
│   │   └── docker-compose.yml
│   ├── kubernetes/
│   │   ├── api-deployment.yaml
│   │   ├── web-deployment.yaml
│   │   ├── postgres-statefulset.yaml
│   │   └── redis-deployment.yaml
│   └── terraform/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
│
├── .github/                       # GitHub Actions
│   └── workflows/
│       ├── ci.yml
│       ├── deploy-api.yml
│       └── deploy-web.yml
│
├── package.json                   # Root package.json
├── turbo.json                     # Turborepo config
├── pnpm-workspace.yaml           # pnpm workspaces
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json                 # Base TypeScript config
└── README.md
```

---

## Package Dependencies

### Dependency Graph

```
apps/mobile
  → @tower/database
  → @tower/shared
  → @tower/validators
  → @tower/ui
  → @tower/sync-engine

apps/web
  → @tower/shared
  → @tower/validators
  → @tower/ui

apps/api
  → @tower/database
  → @tower/shared
  → @tower/validators
  → @tower/sync-engine
  → @tower/ai

packages/ui
  → @tower/shared

packages/sync-engine
  → @tower/database
  → @tower/shared

packages/ai
  → @tower/database
  → @tower/shared
```

---

## Scripts

### Root-Level Scripts

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\"",
    "db:generate": "pnpm --filter @tower/database generate",
    "db:migrate": "pnpm --filter @tower/database migrate",
    "db:studio": "pnpm --filter @tower/database studio",
    "clean": "turbo run clean && rm -rf node_modules"
  }
}
```

### App-Specific Scripts

**Mobile:**
```json
{
  "scripts": {
    "dev": "expo start",
    "ios": "expo start --ios",
    "android": "expo start --android",
    "build:ios": "eas build --platform ios",
    "build:android": "eas build --platform android",
    "test": "jest"
  }
}
```

**Web:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest"
  }
}
```

**API:**
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest"
  }
}
```

---

## TypeScript Configuration

### Root tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  }
}
```

### Package-Specific Configs

Each package extends the root config:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Environment Variables

### Development (.env.local)

```bash
# Database
DATABASE_URL=postgresql://localhost:5432/tower_dev

# Redis
REDIS_URL=redis://localhost:6379

# S3 / Object Storage
S3_BUCKET=tower-dev
S3_REGION=us-west-2
S3_ACCESS_KEY=...
S3_SECRET_KEY=...

# JWT
JWT_SECRET=...
JWT_EXPIRY=900

# API
API_URL=http://localhost:3000/api/v1

# Feature Flags
ENABLE_AI_FEATURES=true
```

### Production (.env.production)

```bash
DATABASE_URL=${{ secrets.DATABASE_URL }}
REDIS_URL=${{ secrets.REDIS_URL }}
# ... etc
```

---

## Development Workflow

### 1. Start Development

```bash
# Install dependencies
pnpm install

# Start all apps in dev mode
pnpm dev
```

This starts:
- Mobile app (Expo)
- Web dashboard (Next.js)
- API server (Fastify)

### 2. Work on Specific App

```bash
# Mobile only
pnpm --filter @tower/mobile dev

# Web only
pnpm --filter @tower/web dev

# API only
pnpm --filter @tower/api dev
```

### 3. Run Tests

```bash
# All packages
pnpm test

# Specific package
pnpm --filter @tower/database test
```

### 4. Build for Production

```bash
# All apps
pnpm build

# Specific app
pnpm --filter @tower/api build
```

---

## Module Boundaries

### Allowed Dependencies

✅ **Apps can depend on:**
- Packages (`@tower/*`)
- External packages (`npm install`)

✅ **Packages can depend on:**
- Other packages (carefully)
- External packages

❌ **Forbidden:**
- Packages depending on apps
- Circular dependencies
- Importing from `dist/` or `build/`

### Enforced with Linting

```typescript
// .eslintrc.js
module.exports = {
  rules: {
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          {
            target: './packages/**',
            from: './apps/**',
            message: 'Packages cannot import from apps'
          }
        ]
      }
    ]
  }
}
```

---

## Turborepo Pipeline

### Build Pipeline

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

**What this means:**
- `build` waits for dependencies to build first (`^build`)
- `dev` never caches (always fresh)
- `test` requires build to complete first

---

## Deployment

### Docker Build

```bash
# API
docker build -f infrastructure/docker/Dockerfile.api -t tower-api .

# Web
docker build -f infrastructure/docker/Dockerfile.web -t tower-web .
```

### Kubernetes Deployment

```bash
kubectl apply -f infrastructure/kubernetes/
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

---

## Next Steps

1. ✅ Folder structure defined
2. ⏳ Scaffold remaining packages
3. ⏳ Set up linting and formatting
4. ⏳ Configure CI/CD
5. ⏳ Implement first API routes

---

**This folder structure provides a scalable, maintainable foundation for TowerOS that can grow from MVP to enterprise without major restructuring.**
