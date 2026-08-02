/**
 * PATCH /sites/:id
 *
 * Update existing site.
 */

import type { FastifyInstance } from 'fastify';
import { db } from '@tower/database';
import { sites, events } from '@tower/database/schema';
import { eq, and } from 'drizzle-orm';
import { authenticate, requirePermission } from '@tower/auth';
import { updateSiteSchema } from '@tower/validators';
import { handleError, Errors } from '../../lib/errors';
import { z } from 'zod';

const paramsSchema = z.object({
  id: z.string(),
});

export async function updateSiteRoute(fastify: FastifyInstance) {
  fastify.patch(
    '/:id',
    {
      preHandler: [authenticate, requirePermission('sites:write')],
    },
    async (request, reply) => {
      try {
        const { user } = request;
        const params = paramsSchema.parse(request.params);
        const body = updateSiteSchema.parse(request.body);

        if (!user) {
          return reply.status(401).send({
            error: {
              code: 'UNAUTHORIZED',
              message: 'Not authenticated',
            },
          });
        }

        // Check site exists and belongs to user's company
        const existingSite = await db.query.sites.findFirst({
          where: and(
            eq(sites.id, params.id),
            eq(sites.companyId, user.companyId)
          ),
        });

        if (!existingSite) {
          throw Errors.notFound('Site');
        }

        // Update site
        const [updatedSite] = await db
          .update(sites)
          .set({
            ...body,
            updatedAt: new Date(),
          })
          .where(eq(sites.id, params.id))
          .returning();

        // Create event for audit trail
        await db.insert(events).values({
          eventType: 'SITE_UPDATED',
          aggregateType: 'Site',
          aggregateId: updatedSite.id,
          userId: user.sub,
          companyId: user.companyId,
          payload: {
            siteId: updatedSite.id,
            changes: body,
          },
          metadata: {
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'] || 'unknown',
          },
        });

        return { site: updatedSite };
      } catch (error) {
        handleError(error, reply);
      }
    }
  );
}
