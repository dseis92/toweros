/**
 * GET /sites/:id
 *
 * Get single site by ID with full details.
 */

import type { FastifyInstance } from 'fastify';
import { db } from '@tower/database';
import { sites } from '@tower/database/schema';
import { eq, and } from 'drizzle-orm';
import { authenticate } from '@tower/auth';
import { handleError, Errors } from '../../lib/errors';
import { z } from 'zod';

const paramsSchema = z.object({
  id: z.string(),
});

export async function getSiteRoute(fastify: FastifyInstance) {
  fastify.get(
    '/:id',
    {
      preHandler: [authenticate],
    },
    async (request, reply) => {
      try {
        const { user } = request;
        const params = paramsSchema.parse(request.params);

        if (!user) {
          return reply.status(401).send({
            error: {
              code: 'UNAUTHORIZED',
              message: 'Not authenticated',
            },
          });
        }

        // Query site with multi-tenant filter
        const site = await db.query.sites.findFirst({
          where: and(
            eq(sites.id, params.id),
            eq(sites.companyId, user.companyId) // Prevent cross-company access
          ),
          with: {
            sectors: {
              with: {
                equipment: true,
              },
            },
            workOrders: {
              orderBy: (workOrders, { desc }) => [desc(workOrders.createdAt)],
              limit: 10,
            },
            photos: {
              orderBy: (photos, { desc }) => [desc(photos.capturedAt)],
              limit: 20,
            },
          },
        });

        if (!site) {
          throw Errors.notFound('Site');
        }

        return { site };
      } catch (error) {
        handleError(error, reply);
      }
    }
  );
}
