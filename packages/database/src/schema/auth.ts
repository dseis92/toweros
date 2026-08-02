/**
 * Authentication Schema
 *
 * Database tables for authentication and session management:
 * - refresh_tokens: Long-lived tokens for obtaining new access tokens
 * - password_reset_tokens: One-time tokens for password reset
 * - login_attempts: Track failed login attempts for rate limiting
 */

import { pgTable, text, timestamp, integer, boolean, index } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';
import { users } from './identity';

/**
 * Refresh Tokens Table
 *
 * Stores long-lived refresh tokens for session management.
 * Each token is tied to a specific device and can be revoked.
 */
export const refreshTokens = pgTable(
  'refresh_tokens',
  {
    /**
     * Refresh token ID (ULID)
     */
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),

    /**
     * User who owns this token
     */
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    /**
     * Hashed token value (bcrypt)
     * The actual token is never stored in plain text
     */
    tokenHash: text('token_hash').notNull(),

    /**
     * Device identifier for session tracking
     * Format: "device_<ulid>"
     */
    deviceId: text('device_id').notNull(),

    /**
     * User agent string
     * Example: "TowerOS Mobile/1.0.0 (iOS 17.0)"
     */
    userAgent: text('user_agent').notNull(),

    /**
     * IP address where token was created
     */
    ipAddress: text('ip_address').notNull(),

    /**
     * Token expiration timestamp
     * Default: 30 days from creation
     */
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),

    /**
     * Last time this token was used for refresh
     * Updated on each successful token refresh
     */
    lastUsedAt: timestamp('last_used_at', { withTimezone: true }),

    /**
     * Token creation timestamp
     */
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),

    /**
     * Token revocation timestamp
     * Set when user logs out or session is terminated
     */
    revokedAt: timestamp('revoked_at', { withTimezone: true }),

    /**
     * Reason for revocation
     * Examples: "user_logout", "password_changed", "admin_revoked"
     */
    revokedReason: text('revoked_reason'),
  },
  (table) => ({
    /**
     * Index for finding user's active tokens
     */
    userIdIdx: index('refresh_tokens_user_id_idx').on(table.userId),

    /**
     * Index for finding tokens by device
     */
    deviceIdIdx: index('refresh_tokens_device_id_idx').on(table.deviceId),

    /**
     * Index for cleanup of expired tokens
     */
    expiresAtIdx: index('refresh_tokens_expires_at_idx').on(table.expiresAt),
  })
);

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;

/**
 * Password Reset Tokens Table
 *
 * Stores one-time tokens for password reset flow.
 * Tokens expire after 1 hour.
 */
export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    /**
     * Token ID (ULID)
     */
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),

    /**
     * User requesting password reset
     */
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    /**
     * Hashed reset token (bcrypt)
     * The actual token is sent via email and never stored in plain text
     */
    tokenHash: text('token_hash').notNull(),

    /**
     * Token expiration timestamp
     * Default: 1 hour from creation
     */
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),

    /**
     * Token creation timestamp
     */
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),

    /**
     * Whether token has been used
     * Tokens are single-use only
     */
    used: boolean('used').notNull().default(false),

    /**
     * Timestamp when token was used
     */
    usedAt: timestamp('used_at', { withTimezone: true }),

    /**
     * IP address where reset was requested
     */
    ipAddress: text('ip_address').notNull(),
  },
  (table) => ({
    /**
     * Index for finding user's reset tokens
     */
    userIdIdx: index('password_reset_tokens_user_id_idx').on(table.userId),

    /**
     * Index for cleanup of expired tokens
     */
    expiresAtIdx: index('password_reset_tokens_expires_at_idx').on(table.expiresAt),
  })
);

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type NewPasswordResetToken = typeof passwordResetTokens.$inferInsert;

/**
 * Login Attempts Table
 *
 * Track failed login attempts for rate limiting and security monitoring.
 * Implements sliding window rate limiting.
 */
export const loginAttempts = pgTable(
  'login_attempts',
  {
    /**
     * Attempt ID (ULID)
     */
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),

    /**
     * Email address used in login attempt
     */
    email: text('email').notNull(),

    /**
     * IP address of login attempt
     */
    ipAddress: text('ip_address').notNull(),

    /**
     * User agent string
     */
    userAgent: text('user_agent').notNull(),

    /**
     * Whether login attempt succeeded
     */
    success: boolean('success').notNull(),

    /**
     * Failure reason if unsuccessful
     * Examples: "invalid_password", "user_not_found", "account_locked"
     */
    failureReason: text('failure_reason'),

    /**
     * Attempt timestamp
     */
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    /**
     * Index for rate limiting by email
     */
    emailIdx: index('login_attempts_email_idx').on(table.email),

    /**
     * Index for rate limiting by IP
     */
    ipAddressIdx: index('login_attempts_ip_address_idx').on(table.ipAddress),

    /**
     * Index for cleanup of old attempts
     */
    createdAtIdx: index('login_attempts_created_at_idx').on(table.createdAt),

    /**
     * Composite index for finding recent failures by email
     */
    emailCreatedAtIdx: index('login_attempts_email_created_at_idx').on(
      table.email,
      table.createdAt
    ),
  })
);

export type LoginAttempt = typeof loginAttempts.$inferSelect;
export type NewLoginAttempt = typeof loginAttempts.$inferInsert;

/**
 * Account Lockouts Table
 *
 * Track temporary account lockouts after excessive failed login attempts.
 */
export const accountLockouts = pgTable(
  'account_lockouts',
  {
    /**
     * Lockout ID (ULID)
     */
    id: text('id')
      .primaryKey()
      .$defaultFn(() => ulid()),

    /**
     * User account that is locked
     */
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    /**
     * Lockout reason
     * Examples: "excessive_failed_logins", "admin_action", "suspicious_activity"
     */
    reason: text('reason').notNull(),

    /**
     * Number of failed attempts that triggered lockout
     */
    failedAttempts: integer('failed_attempts').notNull(),

    /**
     * Lockout start timestamp
     */
    lockedAt: timestamp('locked_at', { withTimezone: true })
      .notNull()
      .defaultNow(),

    /**
     * Lockout expiration timestamp
     * After this time, account is automatically unlocked
     */
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),

    /**
     * Whether lockout has been manually released
     */
    released: boolean('released').notNull().default(false),

    /**
     * Timestamp when lockout was released
     */
    releasedAt: timestamp('released_at', { withTimezone: true }),

    /**
     * User who released the lockout (admin)
     */
    releasedBy: text('released_by').references(() => users.id),
  },
  (table) => ({
    /**
     * Index for finding active lockouts by user
     */
    userIdIdx: index('account_lockouts_user_id_idx').on(table.userId),

    /**
     * Index for cleanup of expired lockouts
     */
    expiresAtIdx: index('account_lockouts_expires_at_idx').on(table.expiresAt),
  })
);

export type AccountLockout = typeof accountLockouts.$inferSelect;
export type NewAccountLockout = typeof accountLockouts.$inferInsert;
