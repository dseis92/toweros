import jwt from 'jsonwebtoken';
import { ulid } from 'ulid';
import type { UserRole } from '@tower/shared';
import { getPermissionsForRole } from './permissions';
import { AuthError, AuthErrorCode, type AccessTokenPayload } from './types';

/**
 * JWT Configuration
 */
const JWT_CONFIG = {
  /**
   * Access token expiration (15 minutes)
   */
  ACCESS_TOKEN_EXPIRY: '15m',

  /**
   * Refresh token expiration (30 days)
   */
  REFRESH_TOKEN_EXPIRY: 30 * 24 * 60 * 60 * 1000, // milliseconds

  /**
   * JWT algorithm (RS256 = RSA asymmetric)
   */
  ALGORITHM: 'RS256' as const,

  /**
   * JWT issuer
   */
  ISSUER: 'toweros',

  /**
   * JWT audience
   */
  AUDIENCE: 'toweros-api',
} as const;

/**
 * Get JWT signing keys from environment
 *
 * In production, these should be loaded from:
 * - AWS Secrets Manager
 * - HashiCorp Vault
 * - Kubernetes Secrets
 *
 * For development, generate keys with:
 * ```bash
 * ssh-keygen -t rsa -b 4096 -m PEM -f jwt.key
 * openssl rsa -in jwt.key -pubout -outform PEM -out jwt.key.pub
 * ```
 */
function getJWTKeys(): { privateKey: string; publicKey: string } {
  const privateKey = process.env.JWT_PRIVATE_KEY;
  const publicKey = process.env.JWT_PUBLIC_KEY;

  if (!privateKey || !publicKey) {
    throw new Error(
      'JWT_PRIVATE_KEY and JWT_PUBLIC_KEY must be set in environment variables'
    );
  }

  return { privateKey, publicKey };
}

/**
 * Generate JWT access token
 *
 * Creates a short-lived (15 min) JWT with user identity and permissions.
 * Signed with RSA private key for asymmetric verification.
 *
 * @param payload - User data to encode in token
 * @returns Signed JWT access token
 */
export function generateAccessToken(payload: {
  userId: string;
  companyId: string;
  email: string;
  role: UserRole;
}): string {
  const { privateKey } = getJWTKeys();

  const permissions = getPermissionsForRole(payload.role);

  const tokenPayload: Omit<AccessTokenPayload, 'iat' | 'exp'> = {
    sub: payload.userId,
    companyId: payload.companyId,
    email: payload.email,
    role: payload.role,
    permissions,
  };

  const token = jwt.sign(tokenPayload, privateKey, {
    algorithm: JWT_CONFIG.ALGORITHM,
    expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
    issuer: JWT_CONFIG.ISSUER,
    audience: JWT_CONFIG.AUDIENCE,
  });

  return token;
}

/**
 * Verify and decode JWT access token
 *
 * Verifies token signature, expiration, and issuer.
 * Uses RSA public key for verification (no private key needed).
 *
 * @param token - JWT access token
 * @returns Decoded token payload
 * @throws AuthError if token is invalid or expired
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  const { publicKey } = getJWTKeys();

  try {
    const decoded = jwt.verify(token, publicKey, {
      algorithms: [JWT_CONFIG.ALGORITHM],
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE,
    }) as AccessTokenPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthError(
        AuthErrorCode.TOKEN_EXPIRED,
        'Access token has expired',
        401
      );
    }

    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthError(
        AuthErrorCode.TOKEN_INVALID,
        'Invalid access token',
        401
      );
    }

    throw new AuthError(
      AuthErrorCode.TOKEN_INVALID,
      'Failed to verify access token',
      401
    );
  }
}

/**
 * Decode JWT without verification
 *
 * Used for inspecting token contents without validating signature.
 * DO NOT use for authentication - always use verifyAccessToken().
 *
 * @param token - JWT access token
 * @returns Decoded token payload or null if invalid format
 */
export function decodeAccessToken(token: string): AccessTokenPayload | null {
  try {
    const decoded = jwt.decode(token) as AccessTokenPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Generate opaque refresh token
 *
 * Creates a random ULID-based token for refresh operations.
 * This token is NOT a JWT - it's an opaque identifier stored in database.
 *
 * @returns Random refresh token
 */
export function generateRefreshToken(): string {
  // Use ULID for lexicographically sortable, time-based ID
  return ulid();
}

/**
 * Get refresh token expiration date
 *
 * @returns Date 30 days from now
 */
export function getRefreshTokenExpiry(): Date {
  return new Date(Date.now() + JWT_CONFIG.REFRESH_TOKEN_EXPIRY);
}

/**
 * Extract bearer token from Authorization header
 *
 * Supports format: "Bearer <token>"
 *
 * @param authHeader - Authorization header value
 * @returns Token string or null if invalid format
 */
export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Get time until token expires
 *
 * @param token - JWT access token
 * @returns Seconds until expiration, or -1 if already expired
 */
export function getTokenTTL(token: string): number {
  const decoded = decodeAccessToken(token);
  if (!decoded || !decoded.exp) {
    return -1;
  }

  const now = Math.floor(Date.now() / 1000);
  const ttl = decoded.exp - now;

  return ttl > 0 ? ttl : -1;
}

/**
 * Check if token is expired
 *
 * @param token - JWT access token
 * @returns True if token is expired
 */
export function isTokenExpired(token: string): boolean {
  return getTokenTTL(token) <= 0;
}
