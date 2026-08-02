# ADR 005: JWT Authentication Strategy

**Status:** Accepted
**Date:** 2026-08-02
**Deciders:** Architecture Team
**Context:** Phase 9 - Authentication System

---

## Context

TowerOS requires a robust authentication system that works across:
- Mobile app (React Native) - Offline-capable
- Web dashboard (Next.js) - Server-side rendering
- API server (Fastify) - Stateless authentication

Requirements:
1. **Offline-first**: Technicians must access cached data without network
2. **Secure**: Industry-standard token security
3. **Multi-tenant**: Complete company data isolation
4. **Role-based**: Different permissions for technicians, managers, admins
5. **Session management**: Token refresh, revocation, device tracking
6. **MFA support**: Future two-factor authentication

---

## Decision

Implement **JWT (JSON Web Tokens) with Refresh Token rotation** for authentication.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Authentication Flow                                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. LOGIN                                                    │
│     POST /auth/login { email, password }                    │
│     ↓                                                        │
│     Validate credentials (bcrypt)                            │
│     ↓                                                        │
│     Generate Access Token (15 min) + Refresh Token (30 days)│
│     ↓                                                        │
│     Store refresh token in database (hashed)                │
│     ↓                                                        │
│     Return { accessToken, refreshToken, user }              │
│                                                              │
│  2. AUTHENTICATED REQUEST                                   │
│     GET /sites                                               │
│     Header: Authorization: Bearer <accessToken>             │
│     ↓                                                        │
│     Verify JWT signature + expiration                        │
│     ↓                                                        │
│     Extract { userId, companyId, role } from payload        │
│     ↓                                                        │
│     Apply Row-Level Security (RLS)                          │
│     ↓                                                        │
│     Return data (filtered by companyId)                     │
│                                                              │
│  3. TOKEN REFRESH                                            │
│     POST /auth/refresh { refreshToken }                     │
│     ↓                                                        │
│     Verify refresh token (signature + database)             │
│     ↓                                                        │
│     Generate new access token (15 min)                       │
│     Generate new refresh token (30 days) - rotation         │
│     ↓                                                        │
│     Invalidate old refresh token                            │
│     ↓                                                        │
│     Return { accessToken, refreshToken }                    │
│                                                              │
│  4. LOGOUT                                                   │
│     POST /auth/logout { refreshToken }                      │
│     ↓                                                        │
│     Delete refresh token from database                       │
│     ↓                                                        │
│     Client clears tokens from storage                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Token Structure

**Access Token (JWT - 15 minutes):**
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
    "permissions": ["sites:read", "equipment:write", "photos:create"],
    "iat": 1704067200,
    "exp": 1704068100
  },
  "signature": "..."
}
```

**Refresh Token (Opaque - 30 days):**
```typescript
{
  id: ulid(), // Stored in database
  userId: 'user_01HQZX...',
  tokenHash: bcrypt.hash(token), // Hashed in DB
  deviceId: 'device_...',
  userAgent: 'TowerOS Mobile/1.0.0',
  expiresAt: '2026-09-01T00:00:00Z',
  createdAt: '2026-08-02T00:00:00Z',
}
```

---

## Implementation Details

### 1. Token Generation

**Access Token:**
- Algorithm: **RS256** (asymmetric RSA)
- Duration: **15 minutes**
- Payload: userId, companyId, role, permissions
- Signed with private key, verified with public key

**Refresh Token:**
- Format: **Opaque random string** (ULID)
- Duration: **30 days**
- Stored in database (hashed with bcrypt)
- One-time use (rotation on refresh)

### 2. Token Storage

**Web (Next.js):**
- Access Token: Memory (React state/context)
- Refresh Token: HttpOnly cookie (secure, sameSite=strict)

**Mobile (React Native):**
- Access Token: Memory (React state/context)
- Refresh Token: Expo SecureStore (encrypted)

**API:**
- Refresh Tokens: PostgreSQL `refresh_tokens` table
- Revoked Tokens: Redis (blocklist for logout before expiry)

### 3. Security Measures

**Password Security:**
- Algorithm: **bcrypt** (cost factor 12)
- Minimum strength: 8 chars, uppercase, lowercase, number
- Max attempts: 5 failed logins → 15 minute lockout

**Token Security:**
- Access tokens: Short-lived (15 min) → limits damage if stolen
- Refresh tokens: Long-lived but one-time use (rotation)
- Token binding: Tied to device ID + user agent
- HTTPS only: All tokens transmitted over TLS

**Multi-Tenancy:**
- `companyId` in JWT payload
- Row-Level Security (RLS) in PostgreSQL
- No cross-company data leakage possible

### 4. Offline Support

Mobile app strategy:
1. **On successful login**: Store refresh token in SecureStore
2. **Access token expires**: Auto-refresh using stored refresh token
3. **Refresh token expires**: Force re-login
4. **Network unavailable**: Use cached data (read-only)
5. **Cached data**: Filtered by companyId from last valid token

### 5. Role-Based Access Control (RBAC)

**Roles:**
- `ADMIN` - Full system access
- `MANAGER` - Manage projects, view all sites
- `TECHNICIAN` - Field work, create equipment, photos
- `VIEWER` - Read-only access

**Permissions:**
```typescript
const PERMISSIONS = {
  ADMIN: ['*'],
  MANAGER: [
    'sites:*',
    'equipment:*',
    'work-orders:*',
    'photos:read',
    'users:read',
  ],
  TECHNICIAN: [
    'sites:read',
    'equipment:write',
    'work-orders:read',
    'work-orders:update-assigned',
    'photos:create',
  ],
  VIEWER: [
    'sites:read',
    'equipment:read',
    'work-orders:read',
    'photos:read',
  ],
};
```

### 6. Session Management

**Device Tracking:**
- Each refresh token tied to device ID
- User can view active sessions: "iPhone 15, Last active 2 hours ago"
- User can revoke sessions remotely

**Concurrent Sessions:**
- Allow multiple devices (mobile + web)
- Max 5 active refresh tokens per user
- Oldest token auto-revoked when limit reached

**Token Revocation:**
- Logout: Delete refresh token from database
- Security event (password change): Delete all refresh tokens
- Admin action: Force logout all company users

---

## Alternatives Considered

### 1. Session-Based Authentication (Cookie-based)

**Pros:**
- Simple implementation
- Server controls sessions fully
- Easy revocation

**Cons:**
- ❌ Requires server-side session storage (Redis)
- ❌ Poor offline support
- ❌ CSRF vulnerabilities
- ❌ Harder to scale horizontally

**Verdict:** Rejected - Poor offline support for field technicians

### 2. OAuth 2.0 + OpenID Connect

**Pros:**
- Industry standard
- Third-party login (Google, Microsoft)
- Well-documented flows

**Cons:**
- ❌ Overkill for internal app
- ❌ Additional complexity
- ❌ Requires external identity provider

**Verdict:** Rejected for MVP - Can add OAuth later for SSO

### 3. JWT with Access Token Only (No Refresh)

**Pros:**
- Simpler implementation
- No token rotation logic

**Cons:**
- ❌ Long-lived access tokens = security risk
- ❌ No way to revoke before expiry
- ❌ Hard to implement logout

**Verdict:** Rejected - Poor security posture

---

## Consequences

### Positive

✅ **Offline-first**: Tokens work without network connectivity
✅ **Stateless**: API servers don't need session storage
✅ **Scalable**: JWT verification is CPU-only (no database lookup per request)
✅ **Secure**: Short-lived access tokens + refresh token rotation
✅ **Multi-tenant**: CompanyId in token prevents data leakage
✅ **Revocable**: Refresh tokens can be invalidated
✅ **Mobile-friendly**: Works with Expo SecureStore

### Negative

⚠️ **Token size**: JWTs larger than session IDs (mitigated by short expiry)
⚠️ **Revocation delay**: Access tokens valid until expiry (max 15 min)
⚠️ **Key management**: Must securely store RSA private key
⚠️ **Clock skew**: Servers must have synchronized clocks (NTP)

### Mitigation

- **Token size**: Use short field names in payload
- **Revocation**: Short 15-min expiry limits exposure
- **Key management**: Use AWS Secrets Manager / Vault
- **Clock skew**: Deploy NTP on all servers

---

## Migration Path

**Phase 1 (MVP):**
- JWT with refresh tokens
- Email/password login
- Role-based access control
- Device tracking

**Phase 2 (Growth):**
- Multi-factor authentication (TOTP)
- Biometric login (Face ID, Touch ID)
- Social login (Google, Microsoft)

**Phase 3 (Enterprise):**
- SAML SSO integration
- LDAP/Active Directory sync
- Hardware security keys (WebAuthn)

---

## Security Checklist

- [x] Access tokens expire quickly (15 min)
- [x] Refresh tokens rotate on use (one-time)
- [x] Refresh tokens hashed in database
- [x] Passwords hashed with bcrypt (cost 12)
- [x] HTTPS required for all auth endpoints
- [x] Rate limiting on login endpoint (5 attempts/15 min)
- [x] Token binding to device ID
- [x] Multi-tenant isolation via RLS
- [x] Audit logging for auth events
- [x] Secure token storage (HttpOnly cookies, SecureStore)

---

## References

- [RFC 7519 - JSON Web Tokens](https://datatracker.ietf.org/doc/html/rfc7519)
- [RFC 6749 - OAuth 2.0](https://datatracker.ietf.org/doc/html/rfc6749)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

---

**Decision:** JWT with refresh token rotation for secure, offline-capable, multi-tenant authentication.
