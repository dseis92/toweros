/**
 * Validation Utilities
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (US format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned[0] === '1')
}

/**
 * Validate ZIP code (US format)
 */
export function isValidZipCode(zip: string): boolean {
  const zipRegex = /^\d{5}$/
  return zipRegex.test(zip)
}

/**
 * Validate latitude
 */
export function isValidLatitude(lat: number): boolean {
  return lat >= -90 && lat <= 90
}

/**
 * Validate longitude
 */
export function isValidLongitude(lng: number): boolean {
  return lng >= -180 && lng <= 180
}

/**
 * Validate azimuth (0-360)
 */
export function isValidAzimuth(azimuth: number): boolean {
  return azimuth >= 0 && azimuth <= 360
}

/**
 * Validate serial number format
 */
export function isValidSerialNumber(serial: string): boolean {
  // Alphanumeric, dashes, minimum 3 characters
  const serialRegex = /^[A-Z0-9-]{3,}$/i
  return serialRegex.test(serial)
}

/**
 * Validate password strength
 */
export interface PasswordStrength {
  valid: boolean
  errors: string[]
  score: number // 0-4
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const errors: string[] = []
  let score = 0

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters')
  } else {
    score++
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letters')
  } else {
    score++
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letters')
  } else {
    score++
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain numbers')
  } else {
    score++
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Password must contain special characters')
  } else {
    score++
  }

  return {
    valid: errors.length === 0,
    errors,
    score,
  }
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-z0-9.-]/gi, '_')
}

/**
 * Validate file type
 */
export function isValidFileType(mimeType: string, allowedTypes: string[]): boolean {
  return allowedTypes.includes(mimeType)
}

/**
 * Validate file size
 */
export function isValidFileSize(sizeBytes: number, maxSizeMB: number): boolean {
  return sizeBytes <= maxSizeMB * 1024 * 1024
}
