/**
 * Error Handling
 *
 * Standardized error responses with proper HTTP status codes.
 */

import type { FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { AuthError } from '@tower/auth';

/**
 * API Error
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Error response format
 */
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Handle error and send appropriate response
 */
export function handleError(error: unknown, reply: FastifyReply): void {
  // Auth errors
  if (error instanceof AuthError) {
    reply.status(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }

  // API errors
  if (error instanceof ApiError) {
    reply.status(error.statusCode).send({
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
    return;
  }

  // Validation errors (Zod)
  if (error instanceof ZodError) {
    reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: error.errors,
      },
    });
    return;
  }

  // Unknown errors - log them for debugging
  console.error('Unhandled error:', error);
  reply.status(500).send({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}

/**
 * Common API errors
 */
export const Errors = {
  notFound: (resource: string) =>
    new ApiError('NOT_FOUND', `${resource} not found`, 404),

  forbidden: (message: string = 'Forbidden') =>
    new ApiError('FORBIDDEN', message, 403),

  badRequest: (message: string, details?: unknown) =>
    new ApiError('BAD_REQUEST', message, 400, details),

  conflict: (message: string) =>
    new ApiError('CONFLICT', message, 409),

  unauthorized: (message: string = 'Unauthorized') =>
    new ApiError('UNAUTHORIZED', message, 401),

  internal: (message: string = 'Internal server error') =>
    new ApiError('INTERNAL_ERROR', message, 500),
} as const;
