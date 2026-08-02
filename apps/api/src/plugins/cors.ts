/**
 * CORS Plugin
 *
 * Configure Cross-Origin Resource Sharing for web clients.
 */

import type { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import { config } from '../config';

export async function corsPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyCors, {
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Total-Count', 'X-Request-ID'],
    maxAge: 86400, // 24 hours
  });
}
