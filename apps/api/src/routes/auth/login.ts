/**
 * POST /auth/login
 *
 * Authenticate user with email and password.
 */

import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AuthService } from '@tower/auth';
import { handleError } from '../../lib/errors';

const authService = new AuthService();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  deviceId: z.string().optional(),
});

export async function loginRoute(fastify: FastifyInstance) {
  fastify.post('/login', async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body);

      const result = await authService.login({
        email: body.email,
        password: body.password,
        deviceId: body.deviceId,
        userAgent: request.headers['user-agent'] || 'unknown',
        ipAddress: request.ip,
      });

      // Set refresh token in HttpOnly cookie (web clients)
      reply.setCookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/api/v1/auth',
      });

      return {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken, // Also return for mobile
        user: result.user,
        expiresAt: result.expiresAt,
      };
    } catch (error) {
      handleError(error, reply);
    }
  });
}
