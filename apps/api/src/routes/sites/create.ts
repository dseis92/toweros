/**
 * POST /sites
 *
 * Create new site.
 */

import type { FastifyInstance } from 'fastify';
import { db } from '@tower/database';
import { sites, events } from '@tower/database/schema';
import { authenticate, requirePermission } from '@tower/auth';
import { createSiteSchema } from '@tower/validators';
import { handleError } from '../../lib/errors';

export async function createSiteRoute(fastify: FastifyInstance) {
  fastify.post(
    '/',
    {
      preHandler: [authenticate, requirePermission('sites:write')],
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

        const body = createSiteSchema.parse(request.body);

        // Create site
        const [newSite] = await db
          .insert(sites)
          .values({
            ...body,
            companyId: user.companyId, // Auto-assign to user's company
            status: 'PLANNING',
          })
          .returning();

        // Create event for audit trail
        await db.insert(events).values({
          eventType: 'SITE_CREATED',
          aggregateType: 'Site',
          aggregateId: newSite.id,
          userId: user.sub,
          companyId: user.companyId,
          payload: {
            siteId: newSite.id,
            name: newSite.name,
            carrier: newSite.carrier,
            latitude: newSite.latitude,
            longitude: newSite.longitude,
          },
          metadata: {
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'] || 'unknown',
          },
        });

        return { site: newSite };
      } catch (error) {
        handleError(error, reply);
      }
    }
  );
}
