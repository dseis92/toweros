/**
 * API Routes
 *
 * Register all route modules.
 */

import type { FastifyInstance } from 'fastify';
import { authRoutes } from './auth';
import { sitesRoutes } from './sites';

export async function registerRoutes(fastify: FastifyInstance) {
  // Health check (public)
  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));

  // Authentication routes
  await fastify.register(authRoutes);

  // Business logic routes
  await fastify.register(sitesRoutes);
}
