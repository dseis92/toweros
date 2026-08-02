# TowerOS API Server

Production-ready Fastify REST API server for TowerOS.

## Features

- **JWT Authentication** - Secure token-based auth with refresh tokens
- **Role-Based Access Control** - ADMIN, MANAGER, TECHNICIAN, VIEWER roles
- **Multi-Tenant** - Complete company data isolation
- **Rate Limiting** - Prevent abuse (100 req/min by default)
- **CORS** - Configurable cross-origin support
- **Security Headers** - Helmet for production security
- **Structured Logging** - Pino with request ID tracking
- **Error Handling** - Standardized error responses
- **Request Validation** - Zod schema validation
- **Event Sourcing** - Complete audit trail
- **TypeScript** - Full type safety

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_PRIVATE_KEY` - RSA private key for signing tokens
- `JWT_PUBLIC_KEY` - RSA public key for verifying tokens

### 3. Generate JWT Keys

```bash
# Generate private key
ssh-keygen -t rsa -b 4096 -m PEM -f jwt.key

# Extract public key
openssl rsa -in jwt.key -pubout -outform PEM -out jwt.key.pub

# Copy to .env (escape newlines as \n)
cat jwt.key | sed 's/$/\\n/' | tr -d '\n'
cat jwt.key.pub | sed 's/$/\\n/' | tr -d '\n'
```

### 4. Run Database Migrations

```bash
cd ../../packages/database
pnpm generate
pnpm migrate
```

### 5. Start Server

Development (with hot reload):
```bash
pnpm dev
```

Production:
```bash
pnpm build
pnpm start
```

## API Endpoints

### Authentication

**POST /api/v1/auth/login**
```json
{
  "email": "mike@example.com",
  "password": "SecurePass123",
  "deviceId": "device_..."
}
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIs...",
  "refreshToken": "01HQZXABC...",
  "user": {
    "id": "user_01HQZX...",
    "email": "mike@example.com",
    "firstName": "Mike",
    "lastName": "Johnson",
    "role": "TECHNICIAN",
    "companyId": "company_01HQZY..."
  },
  "expiresAt": 1704068100
}
```

**POST /api/v1/auth/refresh**
```json
{
  "refreshToken": "01HQZXABC..."
}
```

**POST /api/v1/auth/logout**
```json
{
  "refreshToken": "01HQZXABC..."
}
```

### Sites

**GET /api/v1/sites**
- Requires: Authentication
- Returns: List of sites for user's company

**GET /api/v1/sites/:id**
- Requires: Authentication
- Returns: Site details with sectors, equipment, work orders, photos

**POST /api/v1/sites**
- Requires: Authentication + `sites:write` permission
- Body: `{ name, carrier, latitude, longitude, ... }`
- Returns: Created site

**PATCH /api/v1/sites/:id**
- Requires: Authentication + `sites:write` permission
- Body: `{ name?, status?, ... }`
- Returns: Updated site

### Health Check

**GET /api/v1/health**
```json
{
  "status": "ok",
  "timestamp": "2026-08-02T12:00:00.000Z",
  "uptime": 3600.5
}
```

## Authentication

All protected routes require `Authorization` header:

```
Authorization: Bearer <accessToken>
```

The server will:
1. Extract Bearer token from header
2. Verify JWT signature (RS256)
3. Check token expiration
4. Extract user data (id, companyId, role, permissions)
5. Attach user to `request.user`
6. Check required permissions

Example:
```typescript
fastify.get('/sites', {
  preHandler: [authenticate, requirePermission('sites:read')]
}, async (request, reply) => {
  const { user } = request;
  // user.sub = user ID
  // user.companyId = company ID
  // user.role = TECHNICIAN
  // user.permissions = ['sites:read', ...]
});
```

## Multi-Tenant Isolation

All database queries MUST filter by `companyId`:

```typescript
// CORRECT - Only user's company sites
const sites = await db.query.sites.findMany({
  where: eq(sites.companyId, user.companyId)
});

// WRONG - Would show all companies' sites
const sites = await db.query.sites.findMany();
```

The `companyId` comes from the JWT payload and is automatically set on create operations.

## Error Handling

All errors return consistent format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional additional details
  }
}
```

Common error codes:
- `UNAUTHORIZED` - Missing or invalid token
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request body
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_SERVER_ERROR` - Unexpected error

## Logging

Structured JSON logs with Pino:

```json
{
  "level": 30,
  "time": 1704067200000,
  "pid": 12345,
  "hostname": "api-server",
  "reqId": "req-abc123",
  "req": {
    "method": "GET",
    "url": "/api/v1/sites",
    "headers": { "host": "api.toweros.com" }
  },
  "res": {
    "statusCode": 200
  },
  "responseTime": 45,
  "msg": "request completed"
}
```

Pretty printing in development:
```
[12:00:00.000] INFO (12345): request completed
    reqId: "req-abc123"
    req: {
      "method": "GET",
      "url": "/api/v1/sites"
    }
    res: {
      "statusCode": 200
    }
    responseTime: 45ms
```

## Rate Limiting

Default: 100 requests per minute per IP

Configure in `.env`:
```
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

Response when exceeded:
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later."
  }
}
```

## Security

### Headers (Helmet)
- Content Security Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (HSTS)

### CORS
Configured in `.env`:
```
CORS_ORIGIN=http://localhost:3001,http://localhost:19006
CORS_CREDENTIALS=true
```

### Request Validation
All inputs validated with Zod schemas before processing.

### SQL Injection
Drizzle ORM with parameterized queries - SQL injection impossible.

### XSS Protection
- CSP headers
- JSON responses only (no HTML)
- Input sanitization via validators

## Development

### Hot Reload
```bash
pnpm dev
```

Uses `tsx watch` for instant restart on file changes.

### Type Checking
```bash
pnpm type-check
```

### Linting
```bash
pnpm lint
```

### Build
```bash
pnpm build
```

Outputs to `dist/` using tsup.

## Production Deployment

### Environment
```bash
NODE_ENV=production
LOG_PRETTY=false
LOG_LEVEL=info
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### Health Checks
```bash
curl http://localhost:3000/api/v1/health
```

### Monitoring
- Structured logs → Datadog/CloudWatch
- Request ID tracking for distributed tracing
- Error reporting via Sentry (add integration)
- Metrics via Prometheus (add /metrics endpoint)

## Architecture

```
apps/api/
├── src/
│   ├── routes/           # API endpoints
│   │   ├── auth/         # Authentication
│   │   ├── sites/        # Sites CRUD
│   │   └── index.ts      # Route registry
│   ├── plugins/          # Fastify plugins
│   │   ├── cors.ts
│   │   ├── helmet.ts
│   │   └── rate-limit.ts
│   ├── lib/              # Utilities
│   │   ├── logger.ts     # Pino logger
│   │   └── errors.ts     # Error handling
│   ├── config.ts         # Configuration
│   └── index.ts          # Server entry
├── package.json
├── tsconfig.json
└── .env.example
```

## Next Steps

1. Add more modules (equipment, work orders, photos)
2. Implement WebSocket for real-time updates
3. Add file upload for photos (S3)
4. Add search endpoints (Elasticsearch)
5. Add export endpoints (CSV, PDF)
6. Add metrics endpoint (Prometheus)
7. Add GraphQL gateway (optional)

## License

Private - TowerOS Internal Use Only
