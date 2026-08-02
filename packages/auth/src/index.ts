/**
 * @tower/auth - Authentication & Authorization
 *
 * Production-ready JWT authentication with refresh tokens, RBAC, and MFA support.
 *
 * Features:
 * - JWT access tokens (15 min expiry)
 * - Refresh token rotation (30 day expiry)
 * - Role-based access control (RBAC)
 * - Permission system with wildcards
 * - Account lockout after failed attempts
 * - Session management
 * - Password strength validation
 * - Multi-tenant isolation
 *
 * @example
 * ```typescript
 * // Login
 * const authService = new AuthService();
 * const result = await authService.login({
 *   email: 'mike@example.com',
 *   password: 'SecurePass123',
 *   deviceId: 'device_...',
 *   userAgent: 'TowerOS Mobile/1.0.0',
 *   ipAddress: '192.168.1.1',
 * });
 *
 * // Protect route
 * import { authenticate, requirePermission } from '@tower/auth';
 *
 * fastify.get('/sites', {
 *   preHandler: [authenticate, requirePermission('sites:read')]
 * }, async (request, reply) => {
 *   const { user } = request;
 *   // user.companyId, user.role, user.permissions
 * });
 * ```
 */

// Service
export { AuthService } from './service';

// JWT
export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  decodeAccessToken,
  extractBearerToken,
  getRefreshTokenExpiry,
  getTokenTTL,
  isTokenExpired,
} from './jwt';

// Password
export {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
  needsRehash,
  generateResetToken,
  hashResetToken,
  verifyResetToken,
  PASSWORD_REQUIREMENTS,
} from './password';

// Permissions
export {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  getPermissionsForRole,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getMissingPermissions,
} from './permissions';

// Middleware
export {
  authenticate,
  optionalAuth,
  requirePermission,
  requireAnyPermission,
  requireAllPermissions,
  requireRole,
  requireAnyRole,
} from './middleware';

// Types
export type {
  AccessTokenPayload,
  RefreshTokenData,
  AuthResult,
  LoginCredentials,
  RefreshTokenRequest,
  PasswordChangeRequest,
  PasswordResetRequest,
  SessionInfo,
  PermissionCheck,
} from './types';

export { AuthError, AuthErrorCode } from './types';
