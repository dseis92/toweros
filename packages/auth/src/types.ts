import type { UserRole } from '@tower/shared';

/**
 * JWT Access Token Payload
 *
 * Short-lived token (15 minutes) containing user identity and permissions.
 * Used for authenticating API requests.
 */
export interface AccessTokenPayload {
  /**
   * Subject - User ID (ULID)
   */
  sub: string;

  /**
   * Company ID - For multi-tenant isolation
   */
  companyId: string;

  /**
   * User email
   */
  email: string;

  /**
   * User role (ADMIN, MANAGER, TECHNICIAN, VIEWER)
   */
  role: UserRole;

  /**
   * Granted permissions based on role
   */
  permissions: string[];

  /**
   * Issued at timestamp (seconds since epoch)
   */
  iat: number;

  /**
   * Expiration timestamp (seconds since epoch)
   */
  exp: number;
}

/**
 * Refresh Token Data
 *
 * Long-lived token (30 days) stored in database.
 * Used to obtain new access tokens without re-authentication.
 */
export interface RefreshTokenData {
  /**
   * Refresh token ID (ULID)
   */
  id: string;

  /**
   * User ID who owns this token
   */
  userId: string;

  /**
   * Hashed token value (bcrypt)
   */
  tokenHash: string;

  /**
   * Device identifier for session tracking
   */
  deviceId: string;

  /**
   * User agent string
   */
  userAgent: string;

  /**
   * IP address of token creation
   */
  ipAddress: string;

  /**
   * Token expiration date
   */
  expiresAt: Date;

  /**
   * Token creation date
   */
  createdAt: Date;

  /**
   * Last time this token was used
   */
  lastUsedAt: Date | null;
}

/**
 * Authentication Result
 *
 * Returned after successful login or token refresh.
 */
export interface AuthResult {
  /**
   * JWT access token (15 min expiry)
   */
  accessToken: string;

  /**
   * Opaque refresh token (30 day expiry)
   */
  refreshToken: string;

  /**
   * User data
   */
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    companyId: string;
  };

  /**
   * Access token expiration timestamp (seconds since epoch)
   */
  expiresAt: number;
}

/**
 * Login Credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
  deviceId?: string;
  userAgent?: string;
  ipAddress?: string;
}

/**
 * Token Refresh Request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
  deviceId?: string;
  userAgent?: string;
  ipAddress?: string;
}

/**
 * Password Change Request
 */
export interface PasswordChangeRequest {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

/**
 * Password Reset Request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Active Session Information
 */
export interface SessionInfo {
  id: string;
  deviceId: string;
  userAgent: string;
  ipAddress: string;
  createdAt: Date;
  lastUsedAt: Date | null;
  expiresAt: Date;
  isCurrent: boolean;
}

/**
 * Permission check result
 */
export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
}

/**
 * Authentication error types
 */
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_REVOKED = 'TOKEN_REVOKED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
  PASSWORD_TOO_WEAK = 'PASSWORD_TOO_WEAK',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  MFA_REQUIRED = 'MFA_REQUIRED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

/**
 * Authentication error
 */
export class AuthError extends Error {
  constructor(
    public code: AuthErrorCode,
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
