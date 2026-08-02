/**
 * Formatting Utilities
 */

import { format, formatDistance, formatRelative } from 'date-fns'

/**
 * Format date for display
 */
export function formatDate(date: Date | string | number, formatStr: string = 'MMM d, yyyy'): string {
  return format(new Date(date), formatStr)
}

/**
 * Format datetime for display
 */
export function formatDateTime(date: Date | string | number): string {
  return format(new Date(date), 'MMM d, yyyy h:mm a')
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string | number): string {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

/**
 * Format relative date (e.g., "yesterday at 3:24 PM")
 */
export function formatRelativeDate(date: Date | string | number): string {
  return formatRelative(new Date(date), new Date())
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }

  return phone
}

/**
 * Truncate text
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Format coordinate (latitude/longitude)
 */
export function formatCoordinate(coord: number, isLatitude: boolean): string {
  const direction = isLatitude ? (coord >= 0 ? 'N' : 'S') : coord >= 0 ? 'E' : 'W'
  return `${Math.abs(coord).toFixed(6)}° ${direction}`
}

/**
 * Format elevation
 */
export function formatElevation(feet: number): string {
  return `${feet}' AGL`
}

/**
 * Format azimuth
 */
export function formatAzimuth(degrees: number): string {
  return `${degrees}°`
}
