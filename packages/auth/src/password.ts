import bcrypt from 'bcrypt';
import { AuthError, AuthErrorCode } from './types';

/**
 * Bcrypt cost factor (number of hashing rounds)
 * 12 = ~250ms per hash (good balance of security and UX)
 */
const BCRYPT_ROUNDS = 12;

/**
 * Password strength requirements
 */
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: false, // Optional for better UX
} as const;

/**
 * Common weak passwords to reject
 */
const WEAK_PASSWORDS = new Set([
  'password',
  'password123',
  '12345678',
  'qwerty123',
  'admin123',
  'letmein',
  'welcome',
  'monkey',
  '1234567890',
  'password1',
]);

/**
 * Validate password strength
 *
 * Requirements:
 * - 8-128 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - Not in common weak password list
 *
 * @param password - Password to validate
 * @returns True if valid
 * @throws AuthError if password is too weak
 */
export function validatePasswordStrength(password: string): boolean {
  const errors: string[] = [];

  // Check length
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`);
  }
  if (password.length > PASSWORD_REQUIREMENTS.maxLength) {
    errors.push(`Password must be less than ${PASSWORD_REQUIREMENTS.maxLength} characters`);
  }

  // Check uppercase
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Check lowercase
  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Check number
  if (PASSWORD_REQUIREMENTS.requireNumber && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Check special character (optional)
  if (PASSWORD_REQUIREMENTS.requireSpecialChar && !/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  // Check against common weak passwords
  if (WEAK_PASSWORDS.has(password.toLowerCase())) {
    errors.push('This password is too common. Please choose a stronger password.');
  }

  if (errors.length > 0) {
    throw new AuthError(
      AuthErrorCode.PASSWORD_TOO_WEAK,
      errors.join('. '),
      400
    );
  }

  return true;
}

/**
 * Hash a password using bcrypt
 *
 * Uses bcrypt with cost factor 12 (~250ms to hash).
 * This is intentionally slow to prevent brute-force attacks.
 *
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  // Validate password strength before hashing
  validatePasswordStrength(password);

  // Hash with bcrypt
  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  return hash;
}

/**
 * Verify a password against a hash
 *
 * Uses constant-time comparison to prevent timing attacks.
 *
 * @param password - Plain text password
 * @param hash - Bcrypt hash
 * @returns True if password matches hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    // Invalid hash format
    return false;
  }
}

/**
 * Check if password hash needs rehashing
 *
 * Returns true if the hash was created with a lower cost factor
 * than the current BCRYPT_ROUNDS setting.
 *
 * @param hash - Bcrypt hash to check
 * @returns True if hash should be regenerated
 */
export function needsRehash(hash: string): boolean {
  try {
    const rounds = bcrypt.getRounds(hash);
    return rounds < BCRYPT_ROUNDS;
  } catch (error) {
    // Invalid hash format
    return true;
  }
}

/**
 * Generate a random password reset token
 *
 * Creates a cryptographically secure random token.
 *
 * @returns Random token (32 bytes, hex encoded)
 */
export function generateResetToken(): string {
  // Use crypto.randomBytes for cryptographically secure random values
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash a password reset token
 *
 * Reset tokens should be hashed before storing in database,
 * similar to passwords.
 *
 * @param token - Plain text reset token
 * @returns Hashed token
 */
export async function hashResetToken(token: string): Promise<string> {
  // Use bcrypt with lower cost factor (faster, acceptable for one-time tokens)
  const hash = await bcrypt.hash(token, 10);
  return hash;
}

/**
 * Verify a reset token against a hash
 *
 * @param token - Plain text reset token
 * @param hash - Bcrypt hash
 * @returns True if token matches hash
 */
export async function verifyResetToken(
  token: string,
  hash: string
): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(token, hash);
    return isMatch;
  } catch (error) {
    return false;
  }
}
