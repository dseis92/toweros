/**
 * POST /auth/logout
 *
 * Logout user and revoke refresh token.
 */

import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AuthService } from '@tower/auth';
import { handleError } from '../../lib/errors';

const authService = new AuthService();

const logoutSchema = z.object({
  refreshToken: z.string().optional(),
});

export async function logoutRoute(fastify: FastifyInstance) {
  fastify.post('/logout', async (request, reply) => {
    try {
      const body = logoutSchema.parse(request.body);

      // Get refresh token from body or cookie
      const refreshToken =
        body.refreshToken || request.cookies.refreshToken;

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      // Clear refresh token cookie
      reply.clearCookie('refreshToken', {
        path: '/api/v1/auth',
      });

      return { success: true };
    } catch (error) {
      handleError(error, reply);
    }
  });
}
