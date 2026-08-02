/**
 * Authentication Middleware
 *
 * Express/Fastify middleware for protecting routes with JWT authentication.
 */

import type { FastifyRequest, FastifyReply } from 'fastify';
import { verifyAccessToken, extractBearerToken } from './jwt';
import { hasPermission, hasAnyPermission, hasAllPermissions } from './permissions';
import { AuthError, AuthErrorCode, type AccessTokenPayload } from './types';
import type { UserRole } from '@tower/shared';

/**
 * Extend Fastify request with user data
 */
declare module 'fastify' {
  interface FastifyRequest {
    user?: AccessTokenPayload;
  }
}

/**
 * Authenticate request
 *
 * Verifies JWT access token and attaches user data to request.
 * Does not check permissions - use requirePermission for that.
 *
 * Usage:
 * ```typescript
 * fastify.get('/sites', {
 *   preHandler: authenticate
 * }, async (request, reply) => {
 *   const { user } = request;
 *   // user is guaranteed to exist here
 * });
 * ```
 */
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    const token = extractBearerToken(authHeader);

    if (!token) {
      throw new AuthError(
        AuthErrorCode.TOKEN_INVALID,
        'No authorization token provided',
        401
      );
    }

    const payload = verifyAccessToken(token);
    request.user = payload;
  } catch (error) {
    if (error instanceof AuthError) {
      reply.code(error.statusCode).send({
        error: error.code,
        message: error.message,
      });
      return;
    }

    reply.code(401).send({
      error: AuthErrorCode.TOKEN_INVALID,
      message: 'Invalid authorization token',
    });
  }
}

/**
 * Require specific permission
 *
 * Checks if authenticated user has required permission.
 * Must be used after authenticate middleware.
 *
 * Usage:
 * ```typescript
 * fastify.delete('/sites/:id', {
 *   preHandler: [
 *     authenticate,
 *     requirePermission('sites:delete')
 *   ]
 * }, async (request, reply) => {
 *   // User has sites:delete permission
 * });
 * ```
 */
export function requirePermission(permission: string) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      reply.code(401).send({
        error: AuthErrorCode.TOKEN_INVALID,
        message: 'Not authenticated',
      });
      return;
    }

    if (!hasPermission(request.user.role, permission)) {
      reply.code(403).send({
        error: AuthErrorCode.INSUFFICIENT_PERMISSIONS,
        message: `Missing required permission: ${permission}`,
      });
      return;
    }
  };
}

/**
 * Require ANY of the specified permissions
 *
 * User must have at least one of the permissions.
 *
 * Usage:
 * ```typescript
 * fastify.get('/sites/:id', {
 *   preHandler: [
 *     authenticate,
 *     requireAnyPermission(['sites:read', 'sites:write'])
 *   ]
 * }, async (request, reply) => {
 *   // User has either sites:read OR sites:write
 * });
 * ```
 */
export function requireAnyPermission(permissions: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      reply.code(401).send({
        error: AuthErrorCode.TOKEN_INVALID,
        message: 'Not authenticated',
      });
      return;
    }

    if (!hasAnyPermission(request.user.role, permissions)) {
      reply.code(403).send({
        error: AuthErrorCode.INSUFFICIENT_PERMISSIONS,
        message: `Missing required permissions: ${permissions.join(', ')}`,
      });
      return;
    }
  };
}

/**
 * Require ALL of the specified permissions
 *
 * User must have every permission.
 *
 * Usage:
 * ```typescript
 * fastify.post('/sites/:id/transfer', {
 *   preHandler: [
 *     authenticate,
 *     requireAllPermissions(['sites:write', 'sites:delete'])
 *   ]
 * }, async (request, reply) => {
 *   // User has both sites:write AND sites:delete
 * });
 * ```
 */
export function requireAllPermissions(permissions: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      reply.code(401).send({
        error: AuthErrorCode.TOKEN_INVALID,
        message: 'Not authenticated',
      });
      return;
    }

    if (!hasAllPermissions(request.user.role, permissions)) {
      reply.code(403).send({
        error: AuthErrorCode.INSUFFICIENT_PERMISSIONS,
        message: `Missing required permissions: ${permissions.join(', ')}`,
      });
      return;
    }
  };
}

/**
 * Require specific role
 *
 * User must have exact role match.
 *
 * Usage:
 * ```typescript
 * fastify.get('/admin/users', {
 *   preHandler: [
 *     authenticate,
 *     requireRole('ADMIN')
 *   ]
 * }, async (request, reply) => {
 *   // User has ADMIN role
 * });
 * ```
 */
export function requireRole(role: UserRole) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      reply.code(401).send({
        error: AuthErrorCode.TOKEN_INVALID,
        message: 'Not authenticated',
      });
      return;
    }

    if (request.user.role !== role) {
      reply.code(403).send({
        error: AuthErrorCode.INSUFFICIENT_PERMISSIONS,
        message: `Required role: ${role}`,
      });
      return;
    }
  };
}

/**
 * Require ANY of the specified roles
 *
 * User must have at least one of the roles.
 *
 * Usage:
 * ```typescript
 * fastify.get('/reports', {
 *   preHandler: [
 *     authenticate,
 *     requireAnyRole(['ADMIN', 'MANAGER'])
 *   ]
 * }, async (request, reply) => {
 *   // User is either ADMIN or MANAGER
 * });
 * ```
 */
export function requireAnyRole(roles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      reply.code(401).send({
        error: AuthErrorCode.TOKEN_INVALID,
        message: 'Not authenticated',
      });
      return;
    }

    if (!roles.includes(request.user.role)) {
      reply.code(403).send({
        error: AuthErrorCode.INSUFFICIENT_PERMISSIONS,
        message: `Required roles: ${roles.join(', ')}`,
      });
      return;
    }
  };
}

/**
 * Optional authentication
 *
 * Attaches user data if token is present, but doesn't reject if missing.
 * Useful for routes that have different behavior for authenticated users.
 *
 * Usage:
 * ```typescript
 * fastify.get('/sites', {
 *   preHandler: optionalAuth
 * }, async (request, reply) => {
 *   if (request.user) {
 *     // Show user-specific sites
 *   } else {
 *     // Show public sites
 *   }
 * });
 * ```
 */
export async function optionalAuth(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    const token = extractBearerToken(authHeader);

    if (token) {
      const payload = verifyAccessToken(token);
      request.user = payload;
    }
  } catch (error) {
    // Ignore auth errors for optional auth
    // Request proceeds without user data
  }
}
