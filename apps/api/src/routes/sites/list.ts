/**
 * GET /sites
 *
 * List all sites for authenticated user's company.
 */

import type { FastifyInstance } from 'fastify';
import { db } from '@tower/database';
import { sites } from '@tower/database/schema';
import { eq, desc } from 'drizzle-orm';
import { authenticate } from '@tower/auth';
import { handleError } from '../../lib/errors';

export async function listSitesRoute(fastify: FastifyInstance) {
  fastify.get(
    '/',
    {
      preHandler: [authenticate],
    },
    async (request, reply) => {
      try {
        const { user } = request;

        if (!user) {
          return reply.status(401).send({
            error: {
              code: 'UNAUTHORIZED',
              message: 'Not authenticated',
            },
          });
        }

        // Query sites filtered by company (multi-tenant isolation)
        const companySites = await db.query.sites.findMany({
          where: eq(sites.companyId, user.companyId),
          orderBy: [desc(sites.createdAt)],
          with: {
            sectors: {
              orderBy: (sectors, { asc }) => [asc(sectors.name)],
            },
          },
        });

        return {
          sites: companySites,
          total: companySites.length,
        };
      } catch (error) {
        handleError(error, reply);
      }
    }
  );
}
