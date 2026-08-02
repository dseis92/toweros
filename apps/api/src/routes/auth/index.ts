/**
 * Authentication Routes
 *
 * /auth/*
 */

import type { FastifyInstance } from 'fastify';
import { loginRoute } from './login';
import { refreshRoute } from './refresh';
import { logoutRoute } from './logout';

export async function authRoutes(fastify: FastifyInstance) {
  await fastify.register(async (app) => {
    // Public routes (no authentication required)
    await app.register(loginRoute);
    await app.register(refreshRoute);
    await app.register(logoutRoute);
  }, { prefix: '/auth' });
}
