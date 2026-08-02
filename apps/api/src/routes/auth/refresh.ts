/**
 * POST /auth/refresh
 *
 * Refresh access token using refresh token.
 */

import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AuthService } from '@tower/auth';
import { handleError } from '../../lib/errors';

const authService = new AuthService();

const refreshSchema = z.object({
  refreshToken: z.string().optional(),
  deviceId: z.string().optional(),
});

export async function refreshRoute(fastify: FastifyInstance) {
  fastify.post('/refresh', async (request, reply) => {
    try {
      const body = refreshSchema.parse(request.body);

      // Get refresh token from body or cookie
      const refreshToken =
        body.refreshToken || request.cookies.refreshToken;

      if (!refreshToken) {
        return reply.status(401).send({
          error: {
            code: 'MISSING_REFRESH_TOKEN',
            message: 'Refresh token is required',
          },
        });
      }

      const result = await authService.refreshAccessToken({
        refreshToken,
        deviceId: body.deviceId,
        userAgent: request.headers['user-agent'] || 'unknown',
        ipAddress: request.ip,
      });

      // Update refresh token cookie
      reply.setCookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60,
        path: '/api/v1/auth',
      });

      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
        expiresAt: result.expiresAt,
      };
    } catch (error) {
      handleError(error, reply);
    }
  });
}
