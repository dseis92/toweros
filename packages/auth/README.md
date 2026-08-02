# @tower/auth

Production-grade authentication and authorization for TowerOS.

## Features

- **JWT Access Tokens** - Short-lived (15 min) tokens for API authentication
- **Refresh Token Rotation** - Long-lived (30 day) one-time-use tokens
- **Role-Based Access Control** - ADMIN, MANAGER, TECHNICIAN, VIEWER roles
- **Permission System** - Fine-grained permissions with wildcard support
- **Account Lockout** - Automatic lockout after 5 failed login attempts
- **Session Management** - Track and revoke active sessions per device
- **Password Security** - Bcrypt hashing (cost 12), strength validation
- **Multi-Tenant** - Company isolation via JWT payload
- **Offline Support** - Tokens work without network connectivity

## Installation

```bash
pnpm add @tower/auth
```

## Environment Variables

Required environment variables:

```bash
# JWT signing keys (RS256 asymmetric)
JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n..."
```

Generate keys:

```bash
# Generate private key
ssh-keygen -t rsa -b 4096 -m PEM -f jwt.key

# Extract public key
openssl rsa -in jwt.key -pubout -outform PEM -out jwt.key.pub
```

## Quick Start

### Login

```typescript
import { AuthService } from '@tower/auth';

const authService = new AuthService();

const result = await authService.login({
  email: 'mike@example.com',
  password: 'SecurePass123',
  deviceId: 'device_01HQZX...',
  userAgent: 'TowerOS Mobile/1.0.0',
  ipAddress: '192.168.1.1',
});

// {
//   accessToken: 'eyJhbGciOiJSUzI1NiIs...',
//   refreshToken: '01HQZXABC...',
//   user: {
//     id: 'user_01HQZX...',
//     email: 'mike@example.com',
//     firstName: 'Mike',
//     lastName: 'Johnson',
//     role: 'TECHNICIAN',
//     companyId: 'company_01HQZY...'
//   },
//   expiresAt: 1704068100
// }
```

### Refresh Access Token

```typescript
const newTokens = await authService.refreshAccessToken({
  refreshToken: '01HQZXABC...',
  deviceId: 'device_01HQZX...',
  userAgent: 'TowerOS Mobile/1.0.0',
  ipAddress: '192.168.1.1',
});

// Returns new accessToken and refreshToken
// Old refresh token is automatically revoked (rotation)
```

### Logout

```typescript
await authService.logout(refreshToken);
```

### Protect API Routes (Fastify)

```typescript
import { authenticate, requirePermission } from '@tower/auth';

// Basic authentication
fastify.get('/sites', {
  preHandler: authenticate
}, async (request, reply) => {
  const { user } = request;
  // user.sub = user ID
  // user.companyId = company ID
  // user.role = TECHNICIAN
  // user.permissions = ['sites:read', ...]
});

// Require specific permission
fastify.post('/sites', {
  preHandler: [authenticate, requirePermission('sites:write')]
}, async (request, reply) => {
  // User has sites:write permission
});

// Require any of multiple permissions
fastify.get('/reports', {
  preHandler: [
    authenticate,
    requireAnyPermission(['reports:read', 'reports:write'])
  ]
}, async (request, reply) => {
  // User has either reports:read OR reports:write
});

// Require all permissions
fastify.post('/sites/:id/transfer', {
  preHandler: [
    authenticate,
    requireAllPermissions(['sites:write', 'sites:delete'])
  ]
}, async (request, reply) => {
  // User has both sites:write AND sites:delete
});

// Require specific role
fastify.get('/admin/users', {
  preHandler: [authenticate, requireRole('ADMIN')]
}, async (request, reply) => {
  // User has ADMIN role
});

// Optional authentication
fastify.get('/public-sites', {
  preHandler: optionalAuth
}, async (request, reply) => {
  if (request.user) {
    // Show user-specific sites
  } else {
    // Show public sites
  }
});
```

## Roles and Permissions

### Roles

- **ADMIN** - Full system access (`*` permission)
- **MANAGER** - Manage projects, view all sites, read users
- **TECHNICIAN** - Field work, create equipment, update assigned work orders
- **VIEWER** - Read-only access

### Permission Format

Permissions follow the format: `resource:action`

Examples:
- `sites:read` - Read sites
- `equipment:write` - Create/update equipment
- `sites:*` - All site operations
- `*` - All permissions (admin only)

### Permission Hierarchy

```typescript
import { PERMISSIONS } from '@tower/auth';

PERMISSIONS.SITES_READ          // 'sites:read'
PERMISSIONS.SITES_WRITE         // 'sites:write'
PERMISSIONS.SITES_DELETE        // 'sites:delete'
PERMISSIONS.SITES_ALL           // 'sites:*'

PERMISSIONS.EQUIPMENT_READ      // 'equipment:read'
PERMISSIONS.EQUIPMENT_WRITE     // 'equipment:write'
PERMISSIONS.EQUIPMENT_DELETE    // 'equipment:delete'
PERMISSIONS.EQUIPMENT_ALL       // 'equipment:*'

PERMISSIONS.WORK_ORDERS_READ    // 'work-orders:read'
PERMISSIONS.WORK_ORDERS_WRITE   // 'work-orders:write'
PERMISSIONS.WORK_ORDERS_UPDATE_ASSIGNED  // 'work-orders:update-assigned'
PERMISSIONS.WORK_ORDERS_ALL     // 'work-orders:*'

PERMISSIONS.SYSTEM_ALL          // '*' (admin only)
```

### Check Permissions Manually

```typescript
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@tower/auth';

// Check single permission
if (hasPermission('TECHNICIAN', 'sites:read')) {
  // Technician can read sites
}

// Check any of multiple permissions
if (hasAnyPermission('TECHNICIAN', ['sites:write', 'sites:delete'])) {
  // Technician has either permission
}

// Check all permissions
if (hasAllPermissions('MANAGER', ['sites:read', 'equipment:read'])) {
  // Manager has both permissions
}
```

## Password Security

### Password Requirements

```typescript
import { PASSWORD_REQUIREMENTS } from '@tower/auth';

// {
//   minLength: 8,
//   maxLength: 128,
//   requireUppercase: true,
//   requireLowercase: true,
//   requireNumber: true,
//   requireSpecialChar: false
// }
```

### Validate Password Strength

```typescript
import { validatePasswordStrength } from '@tower/auth';

try {
  validatePasswordStrength('SecurePass123');
  // Valid password
} catch (error) {
  // AuthError with validation failures
}
```

### Hash Password

```typescript
import { hashPassword } from '@tower/auth';

const hash = await hashPassword('SecurePass123');
// $2b$12$... (bcrypt hash)
```

### Verify Password

```typescript
import { verifyPassword } from '@tower/auth';

const isValid = await verifyPassword('SecurePass123', hash);
```

## Session Management

### Get Active Sessions

```typescript
const sessions = await authService.getActiveSessions(
  userId,
  currentDeviceId
);

// [
//   {
//     id: 'token_01HQZX...',
//     deviceId: 'device_01HQZX...',
//     userAgent: 'TowerOS Mobile/1.0.0',
//     ipAddress: '192.168.1.1',
//     createdAt: Date,
//     lastUsedAt: Date,
//     expiresAt: Date,
//     isCurrent: true
//   },
//   ...
// ]
```

### Revoke Session

```typescript
// Revoke specific session
await authService.revokeSession(userId, sessionId);

// Revoke all sessions except current
await authService.revokeAllSessions(userId, currentSessionId);
```

## Account Lockout

After **5 failed login attempts** within **15 minutes**, the account is locked for **15 minutes**.

Lockout is automatic and transparent. Login attempts during lockout return:

```json
{
  "error": "ACCOUNT_LOCKED",
  "message": "Account is locked. Try again in 12 minutes."
}
```

## Token Structure

### Access Token (JWT)

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_01HQZX...",
    "companyId": "company_01HQZY...",
    "email": "mike@example.com",
    "role": "TECHNICIAN",
    "permissions": ["sites:read", "equipment:write", ...],
    "iat": 1704067200,
    "exp": 1704068100
  }
}
```

**Expiry:** 15 minutes
**Signature:** RS256 (RSA asymmetric)

### Refresh Token

**Format:** Opaque ULID (`01HQZXABC...`)
**Expiry:** 30 days
**Storage:** Hashed in database (bcrypt)
**Usage:** One-time use (rotated on refresh)

## Error Handling

```typescript
import { AuthError, AuthErrorCode } from '@tower/auth';

try {
  await authService.login(credentials);
} catch (error) {
  if (error instanceof AuthError) {
    switch (error.code) {
      case AuthErrorCode.INVALID_CREDENTIALS:
        // Invalid email or password
        break;
      case AuthErrorCode.ACCOUNT_LOCKED:
        // Too many failed attempts
        break;
      case AuthErrorCode.ACCOUNT_DISABLED:
        // Account is disabled
        break;
      case AuthErrorCode.TOKEN_EXPIRED:
        // Access token expired
        break;
      case AuthErrorCode.TOKEN_INVALID:
        // Invalid token signature
        break;
      case AuthErrorCode.INSUFFICIENT_PERMISSIONS:
        // Missing required permission
        break;
      case AuthErrorCode.PASSWORD_TOO_WEAK:
        // Password doesn't meet requirements
        break;
      default:
        // Other error
    }
  }
}
```

## Multi-Tenant Isolation

All authentication respects multi-tenant boundaries:

1. **JWT Payload** - Contains `companyId` for every user
2. **Row-Level Security** - Database queries filtered by `companyId`
3. **Permission Checks** - Permissions scoped to user's company

Example:

```typescript
// User from Company A
const userA = {
  sub: 'user_A',
  companyId: 'company_A',
  role: 'TECHNICIAN'
};

// User from Company B
const userB = {
  sub: 'user_B',
  companyId: 'company_B',
  role: 'TECHNICIAN'
};

// Database query automatically filtered
const sites = await db.query.sites.findMany({
  where: eq(sites.companyId, userA.companyId)
});
// Returns only Company A's sites
```

## Security Best Practices

✅ **Access tokens are short-lived** (15 min) - Limits damage if stolen
✅ **Refresh tokens rotate** - One-time use prevents replay attacks
✅ **Refresh tokens are hashed** - Never stored in plain text
✅ **Passwords use bcrypt** (cost 12) - ~250ms to hash, prevents brute-force
✅ **Account lockout** - 5 failed attempts → 15 min lockout
✅ **HTTPS required** - All tokens transmitted over TLS
✅ **Token binding** - Tokens tied to device ID
✅ **Multi-tenant isolation** - CompanyId in JWT prevents data leakage
✅ **Audit logging** - All auth events recorded

## Offline Support

Mobile app strategy:

1. **On login**: Store refresh token in Expo SecureStore
2. **Access token expires**: Auto-refresh using stored token
3. **Network unavailable**: Use cached data (read-only)
4. **Refresh token expires**: Force re-login

Web strategy:

1. **On login**: Store refresh token in HttpOnly cookie
2. **Access token expires**: Auto-refresh via API call
3. **Network unavailable**: Show offline indicator
4. **Refresh token expires**: Redirect to login

## Database Tables

This package requires the following database tables (defined in `@tower/database`):

- `refresh_tokens` - Long-lived tokens for session management
- `password_reset_tokens` - One-time password reset tokens
- `login_attempts` - Failed login tracking for rate limiting
- `account_lockouts` - Temporary account lockouts

Run migrations:

```bash
cd packages/database
pnpm generate
pnpm migrate
```

## License

Private - TowerOS Internal Use Only
