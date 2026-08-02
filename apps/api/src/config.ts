/**
 * API Server Configuration
 *
 * Loads and validates environment variables.
 * All configuration is centralized here.
 */

import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

// Load .env file
loadEnv();

/**
 * Environment variable schema
 */
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),

  // Database
  DATABASE_URL: z.string().url(),
  DATABASE_POOL_MIN: z.coerce.number().default(2),
  DATABASE_POOL_MAX: z.coerce.number().default(10),

  // Redis
  REDIS_URL: z.string().url().optional(),
  REDIS_PASSWORD: z.string().optional(),

  // JWT
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),

  // CORS
  CORS_ORIGIN: z.string().default('*'),
  CORS_CREDENTIALS: z.coerce.boolean().default(true),

  // Rate Limiting
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW: z.coerce.number().default(60000),

  // Logging
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  LOG_PRETTY: z.coerce.boolean().default(false),

  // S3
  S3_ENDPOINT: z.string().url().optional(),
  S3_REGION: z.string().default('us-east-1'),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),

  // Application
  API_VERSION: z.string().default('v1'),
  API_PREFIX: z.string().default('/api/v1'),
});

/**
 * Validated environment variables
 */
const env = envSchema.parse(process.env);

/**
 * Application configuration
 */
export const config = {
  /**
   * Server configuration
   */
  server: {
    env: env.NODE_ENV,
    port: env.PORT,
    host: env.HOST,
    isDevelopment: env.NODE_ENV === 'development',
    isProduction: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
  },

  /**
   * Database configuration
   */
  database: {
    url: env.DATABASE_URL,
    poolMin: env.DATABASE_POOL_MIN,
    poolMax: env.DATABASE_POOL_MAX,
  },

  /**
   * Redis configuration
   */
  redis: {
    url: env.REDIS_URL,
    password: env.REDIS_PASSWORD,
    enabled: Boolean(env.REDIS_URL),
  },

  /**
   * JWT configuration
   */
  jwt: {
    privateKey: env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    publicKey: env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n'),
  },

  /**
   * CORS configuration
   */
  cors: {
    origin: env.CORS_ORIGIN.split(',').map(o => o.trim()),
    credentials: env.CORS_CREDENTIALS,
  },

  /**
   * Rate limiting configuration
   */
  rateLimit: {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW,
  },

  /**
   * Logging configuration
   */
  logging: {
    level: env.LOG_LEVEL,
    pretty: env.LOG_PRETTY,
  },

  /**
   * S3 configuration
   */
  s3: {
    endpoint: env.S3_ENDPOINT,
    region: env.S3_REGION,
    bucket: env.S3_BUCKET,
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    enabled: Boolean(env.S3_BUCKET && env.S3_ACCESS_KEY_ID),
  },

  /**
   * API configuration
   */
  api: {
    version: env.API_VERSION,
    prefix: env.API_PREFIX,
  },
} as const;

/**
 * Validate required configuration
 */
export function validateConfig(): void {
  const errors: string[] = [];

  // Check database URL
  if (!config.database.url) {
    errors.push('DATABASE_URL is required');
  }

  // Check JWT keys
  if (!config.jwt.privateKey || !config.jwt.publicKey) {
    errors.push('JWT_PRIVATE_KEY and JWT_PUBLIC_KEY are required');
  }

  if (errors.length > 0) {
    throw new Error(
      `Configuration validation failed:\n${errors.map(e => `  - ${e}`).join('\n')}`
    );
  }
}
