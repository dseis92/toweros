/**
 * TowerOS API Server
 *
 * Production-ready Fastify server with:
 * - JWT authentication
 * - Role-based access control
 * - Multi-tenant isolation
 * - Rate limiting
 * - Structured logging
 * - Error handling
 * - Request validation
 */

import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import { config, validateConfig } from './config';
import { logger } from './lib/logger';
import { corsPlugin } from './plugins/cors';
import { helmetPlugin } from './plugins/helmet';
import { rateLimitPlugin } from './plugins/rate-limit';
import { registerRoutes } from './routes';

/**
 * Create and configure Fastify instance
 */
async function createServer() {
  // Validate configuration
  validateConfig();

  // Create Fastify instance
  const fastify = Fastify({
    logger,
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'reqId',
    disableRequestLogging: false,
    trustProxy: true, // For proper IP detection behind proxy
  });

  // Register plugins
  await fastify.register(fastifyCookie);
  await fastify.register(corsPlugin);
  await fastify.register(helmetPlugin);
  await fastify.register(rateLimitPlugin);

  // Register routes with prefix
  await fastify.register(registerRoutes, {
    prefix: config.api.prefix,
  });

  // Global error handler
  fastify.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    reply.status(error.statusCode || 500).send({
      error: {
        code: error.code || 'INTERNAL_SERVER_ERROR',
        message: error.message || 'An unexpected error occurred',
      },
    });
  });

  // 404 handler
  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      error: {
        code: 'NOT_FOUND',
        message: `Route ${request.method} ${request.url} not found`,
      },
    });
  });

  return fastify;
}

/**
 * Start server
 */
async function start() {
  try {
    const fastify = await createServer();

    await fastify.listen({
      port: config.server.port,
      host: config.server.host,
    });

    logger.info(
      `TowerOS API Server listening on http://${config.server.host}:${config.server.port}`
    );
    logger.info(`Environment: ${config.server.env}`);
    logger.info(`API Prefix: ${config.api.prefix}`);
  } catch (error) {
    logger.fatal(error, 'Failed to start server');
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start server
start();
