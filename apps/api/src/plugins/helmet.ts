/**
 * Helmet Plugin
 *
 * Security headers for production.
 */

import type { FastifyInstance } from 'fastify';
import fastifyHelmet from '@fastify/helmet';

export async function helmetPlugin(fastify: FastifyInstance) {
  await fastify.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false, // Allow embedding
  });
}
