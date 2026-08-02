export * from './enums'

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.API_URL || 'http://localhost:3000/api/v1',
  WS_URL: process.env.WS_URL || 'ws://localhost:3000/ws',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
} as const

// File Upload
export const UPLOAD = {
  MAX_PHOTO_SIZE_MB: 10,
  MAX_DOCUMENT_SIZE_MB: 50,
  ALLOWED_PHOTO_TYPES: ['image/jpeg', 'image/png', 'image/heic'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const

// Sync
export const SYNC = {
  BATCH_SIZE: 100,
  RETRY_DELAY_MS: 5000,
  MAX_RETRIES: 5,
} as const

// Cache TTL (seconds)
export const CACHE_TTL = {
  SITE: 300, // 5 minutes
  EQUIPMENT: 300,
  WORK_ORDER: 60, // 1 minute
  USER: 3600, // 1 hour
} as const
