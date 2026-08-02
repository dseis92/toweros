/**
 * Authentication Service
 *
 * Main service for handling authentication operations:
 * - Login / Logout
 * - Token refresh
 * - Password management
 * - Session management
 */

import { db } from '@tower/database';
import { users, refreshTokens, loginAttempts, accountLockouts } from '@tower/database/schema';
import { eq, and, gte, desc } from 'drizzle-orm';
import { ulid } from 'ulid';
import {
  hashPassword,
  verifyPassword,
  needsRehash,
  generateResetToken,
  hashResetToken,
} from './password';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  getRefreshTokenExpiry,
} from './jwt';
import {
  AuthError,
  AuthErrorCode,
  type AuthResult,
  type LoginCredentials,
  type RefreshTokenRequest,
  type PasswordChangeRequest,
  type SessionInfo,
} from './types';

/**
 * Rate limiting configuration
 */
const RATE_LIMIT = {
  /**
   * Maximum failed login attempts before lockout
   */
  MAX_FAILED_ATTEMPTS: 5,

  /**
   * Lockout duration in minutes
   */
  LOCKOUT_DURATION_MINUTES: 15,

  /**
   * Time window for counting failed attempts (minutes)
   */
  FAILED_ATTEMPTS_WINDOW_MINUTES: 15,

  /**
   * Maximum active refresh tokens per user
   */
  MAX_REFRESH_TOKENS_PER_USER: 5,
} as const;

/**
 * Authentication Service
 */
export class AuthService {
  /**
   * Login with email and password
   *
   * Flow:
   * 1. Check if account is locked
   * 2. Validate credentials
   * 3. Check password hash needs rehash
   * 4. Generate tokens
   * 5. Store refresh token
   * 6. Record successful login
   * 7. Clean up old refresh tokens
   *
   * @param credentials - Login credentials
   * @returns Authentication result with tokens
   * @throws AuthError if authentication fails
   */
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const { email, password, deviceId, userAgent, ipAddress } = credentials;

    // Check if account is locked
    await this.checkAccountLockout(email);

    try {
      // Find user by email
      const user = await db.query.users.findFirst({
        where: eq(users.email, email.toLowerCase()),
      });

      if (!user) {
        await this.recordFailedLogin(email, 'user_not_found', ipAddress, userAgent);
        throw new AuthError(
          AuthErrorCode.INVALID_CREDENTIALS,
          'Invalid email or password',
          401
        );
      }

      // Verify password
      const isValidPassword = await verifyPassword(password, user.passwordHash);
      if (!isValidPassword) {
        await this.recordFailedLogin(email, 'invalid_password', ipAddress, userAgent);
        throw new AuthError(
          AuthErrorCode.INVALID_CREDENTIALS,
          'Invalid email or password',
          401
        );
      }

      // Check if user is active
      if (user.status !== 'ACTIVE') {
        throw new AuthError(
          AuthErrorCode.ACCOUNT_DISABLED,
          'Account is disabled',
          403
        );
      }

      // Check if password needs rehashing (cost factor increased)
      if (needsRehash(user.passwordHash)) {
        const newHash = await hashPassword(password);
        await db
          .update(users)
          .set({ passwordHash: newHash, updatedAt: new Date() })
          .where(eq(users.id, user.id));
      }

      // Generate tokens
      const accessToken = generateAccessToken({
        userId: user.id,
        companyId: user.companyId,
        email: user.email,
        role: user.role,
      });

      const refreshTokenValue = generateRefreshToken();
      // Hash refresh token directly with bcrypt (skip password validation)
      const bcrypt = require('bcrypt');
      const refreshTokenHash = await bcrypt.hash(refreshTokenValue, 12);

      // Store refresh token
      await db.insert(refreshTokens).values({
        userId: user.id,
        tokenHash: refreshTokenHash,
        deviceId: deviceId || `device_${ulid()}`,
        userAgent: userAgent || 'unknown',
        ipAddress: ipAddress || 'unknown',
        expiresAt: getRefreshTokenExpiry(),
      });

      // Record successful login
      await this.recordSuccessfulLogin(email, ipAddress, userAgent);

      // Clean up old refresh tokens (keep max 5 per user)
      await this.cleanupOldRefreshTokens(user.id);

      return {
        accessToken,
        refreshToken: refreshTokenValue,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          companyId: user.companyId,
        },
        expiresAt: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutes
      };
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError(
        AuthErrorCode.INVALID_CREDENTIALS,
        'Authentication failed',
        401
      );
    }
  }

  /**
   * Refresh access token using refresh token
   *
   * Flow:
   * 1. Find refresh token in database
   * 2. Verify token hash
   * 3. Check token not expired or revoked
   * 4. Generate new access token
   * 5. Rotate refresh token (one-time use)
   * 6. Invalidate old refresh token
   *
   * @param request - Refresh token request
   * @returns New authentication result
   * @throws AuthError if refresh fails
   */
  async refreshAccessToken(request: RefreshTokenRequest): Promise<AuthResult> {
    const { refreshToken, deviceId, userAgent, ipAddress } = request;

    // Find all refresh tokens for verification
    // We don't know which one matches, so we need to check all non-revoked tokens
    const tokens = await db.query.refreshTokens.findMany({
      where: and(
        eq(refreshTokens.deviceId, deviceId || ''),
        gte(refreshTokens.expiresAt, new Date())
      ),
    });

    let validToken = null;
    for (const token of tokens) {
      const isValid = await verifyPassword(refreshToken, token.tokenHash);
      if (isValid && !token.revokedAt) {
        validToken = token;
        break;
      }
    }

    if (!validToken) {
      throw new AuthError(
        AuthErrorCode.TOKEN_INVALID,
        'Invalid or expired refresh token',
        401
      );
    }

    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.id, validToken.userId),
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new AuthError(
        AuthErrorCode.ACCOUNT_DISABLED,
        'Account is disabled',
        403
      );
    }

    // Generate new tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      companyId: user.companyId,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken();
    // Hash refresh token directly with bcrypt (skip password validation)
    const bcrypt = require('bcrypt');
    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 12);

    // Store new refresh token
    await db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash: newRefreshTokenHash,
      deviceId: validToken.deviceId,
      userAgent: userAgent || validToken.userAgent,
      ipAddress: ipAddress || validToken.ipAddress,
      expiresAt: getRefreshTokenExpiry(),
    });

    // Revoke old refresh token (rotation)
    await db
      .update(refreshTokens)
      .set({
        revokedAt: new Date(),
        revokedReason: 'token_rotated',
      })
      .where(eq(refreshTokens.id, validToken.id));

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId,
      },
      expiresAt: Math.floor(Date.now() / 1000) + 15 * 60,
    };
  }

  /**
   * Logout and revoke refresh token
   *
   * @param refreshToken - Refresh token to revoke
   */
  async logout(refreshToken: string): Promise<void> {
    // Find and revoke the refresh token
    const tokens = await db.query.refreshTokens.findMany({
      where: gte(refreshTokens.expiresAt, new Date()),
    });

    for (const token of tokens) {
      const isMatch = await verifyPassword(refreshToken, token.tokenHash);
      if (isMatch && !token.revokedAt) {
        await db
          .update(refreshTokens)
          .set({
            revokedAt: new Date(),
            revokedReason: 'user_logout',
          })
          .where(eq(refreshTokens.id, token.id));
        return;
      }
    }
  }

  /**
   * Get user's active sessions
   *
   * @param userId - User ID
   * @param currentDeviceId - Current device ID to mark as current
   * @returns List of active sessions
   */
  async getActiveSessions(
    userId: string,
    currentDeviceId?: string
  ): Promise<SessionInfo[]> {
    const tokens = await db.query.refreshTokens.findMany({
      where: and(
        eq(refreshTokens.userId, userId),
        gte(refreshTokens.expiresAt, new Date())
      ),
      orderBy: [desc(refreshTokens.createdAt)],
    });

    return tokens
      .filter((token) => !token.revokedAt)
      .map((token) => ({
        id: token.id,
        deviceId: token.deviceId,
        userAgent: token.userAgent,
        ipAddress: token.ipAddress,
        createdAt: token.createdAt,
        lastUsedAt: token.lastUsedAt,
        expiresAt: token.expiresAt,
        isCurrent: token.deviceId === currentDeviceId,
      }));
  }

  /**
   * Revoke a specific session
   *
   * @param userId - User ID
   * @param sessionId - Session (refresh token) ID to revoke
   */
  async revokeSession(userId: string, sessionId: string): Promise<void> {
    await db
      .update(refreshTokens)
      .set({
        revokedAt: new Date(),
        revokedReason: 'user_revoked',
      })
      .where(
        and(eq(refreshTokens.id, sessionId), eq(refreshTokens.userId, userId))
      );
  }

  /**
   * Revoke all sessions for a user (except current)
   *
   * @param userId - User ID
   * @param currentSessionId - Current session to keep active
   */
  async revokeAllSessions(
    userId: string,
    currentSessionId?: string
  ): Promise<void> {
    const conditions = [eq(refreshTokens.userId, userId)];

    if (currentSessionId) {
      conditions.push(eq(refreshTokens.id, currentSessionId));
    }

    await db
      .update(refreshTokens)
      .set({
        revokedAt: new Date(),
        revokedReason: 'user_revoked_all',
      })
      .where(and(...conditions));
  }

  /**
   * Change user password
   *
   * Revokes all refresh tokens to force re-login on all devices.
   *
   * @param request - Password change request
   */
  async changePassword(request: PasswordChangeRequest): Promise<void> {
    const { userId, currentPassword, newPassword } = request;

    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new AuthError(
        AuthErrorCode.INVALID_CREDENTIALS,
        'User not found',
        404
      );
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new AuthError(
        AuthErrorCode.INVALID_CREDENTIALS,
        'Current password is incorrect',
        401
      );
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await db
      .update(users)
      .set({
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    // Revoke all refresh tokens (force re-login)
    await db
      .update(refreshTokens)
      .set({
        revokedAt: new Date(),
        revokedReason: 'password_changed',
      })
      .where(eq(refreshTokens.userId, userId));
  }

  /**
   * Check if account is locked
   *
   * @param email - User email
   * @throws AuthError if account is locked
   */
  private async checkAccountLockout(email: string): Promise<void> {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (!user) {
      return; // Don't reveal if user exists
    }

    const lockout = await db.query.accountLockouts.findFirst({
      where: and(
        eq(accountLockouts.userId, user.id),
        gte(accountLockouts.expiresAt, new Date()),
        eq(accountLockouts.released, false)
      ),
    });

    if (lockout) {
      const minutesRemaining = Math.ceil(
        (lockout.expiresAt.getTime() - Date.now()) / (1000 * 60)
      );
      throw new AuthError(
        AuthErrorCode.ACCOUNT_LOCKED,
        `Account is locked. Try again in ${minutesRemaining} minutes.`,
        429
      );
    }
  }

  /**
   * Record failed login attempt
   *
   * Implements account lockout after 5 failed attempts in 15 minutes.
   */
  private async recordFailedLogin(
    email: string,
    reason: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await db.insert(loginAttempts).values({
      email: email.toLowerCase(),
      ipAddress: ipAddress || 'unknown',
      userAgent: userAgent || 'unknown',
      success: false,
      failureReason: reason,
    });

    // Check for excessive failed attempts
    const windowStart = new Date(
      Date.now() - RATE_LIMIT.FAILED_ATTEMPTS_WINDOW_MINUTES * 60 * 1000
    );

    const recentFailures = await db.query.loginAttempts.findMany({
      where: and(
        eq(loginAttempts.email, email.toLowerCase()),
        eq(loginAttempts.success, false),
        gte(loginAttempts.createdAt, windowStart)
      ),
    });

    if (recentFailures.length >= RATE_LIMIT.MAX_FAILED_ATTEMPTS) {
      // Lock account
      const user = await db.query.users.findFirst({
        where: eq(users.email, email.toLowerCase()),
      });

      if (user) {
        const lockoutExpiry = new Date(
          Date.now() + RATE_LIMIT.LOCKOUT_DURATION_MINUTES * 60 * 1000
        );

        await db.insert(accountLockouts).values({
          userId: user.id,
          reason: 'excessive_failed_logins',
          failedAttempts: recentFailures.length,
          expiresAt: lockoutExpiry,
        });
      }
    }
  }

  /**
   * Record successful login attempt
   */
  private async recordSuccessfulLogin(
    email: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await db.insert(loginAttempts).values({
      email: email.toLowerCase(),
      ipAddress: ipAddress || 'unknown',
      userAgent: userAgent || 'unknown',
      success: true,
    });
  }

  /**
   * Clean up old refresh tokens
   *
   * Keeps only the 5 most recent tokens per user.
   */
  private async cleanupOldRefreshTokens(userId: string): Promise<void> {
    const userTokens = await db.query.refreshTokens.findMany({
      where: eq(refreshTokens.userId, userId),
      orderBy: [desc(refreshTokens.createdAt)],
    });

    // Keep max 5 tokens
    if (userTokens.length > RATE_LIMIT.MAX_REFRESH_TOKENS_PER_USER) {
      const tokensToRevoke = userTokens.slice(
        RATE_LIMIT.MAX_REFRESH_TOKENS_PER_USER
      );

      for (const token of tokensToRevoke) {
        await db
          .update(refreshTokens)
          .set({
            revokedAt: new Date(),
            revokedReason: 'max_tokens_exceeded',
          })
          .where(eq(refreshTokens.id, token.id));
      }
    }
  }
}
