/**
 * Sites Routes
 *
 * /sites/*
 */

import type { FastifyInstance } from 'fastify';
import { listSitesRoute } from './list';
import { getSiteRoute } from './get';
import { createSiteRoute } from './create';
import { updateSiteRoute } from './update';

export async function sitesRoutes(fastify: FastifyInstance) {
  await fastify.register(async (app) => {
    await app.register(listSitesRoute);
    await app.register(getSiteRoute);
    await app.register(createSiteRoute);
    await app.register(updateSiteRoute);
  }, { prefix: '/sites' });
}
