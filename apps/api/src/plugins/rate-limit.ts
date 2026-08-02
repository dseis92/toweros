/**
 * Rate Limiting Plugin
 *
 * Prevent abuse with request rate limiting.
 */

import type { FastifyInstance } from 'fastify';
import fastifyRateLimit from '@fastify/rate-limit';
import { config } from '../config';

export async function rateLimitPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyRateLimit, {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.timeWindow,
    errorResponseBuilder: () => ({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests. Please try again later.',
      },
    }),
  });
}
