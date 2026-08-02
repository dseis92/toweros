import { UserRole } from '@tower/shared';

/**
 * Permission strings for role-based access control
 *
 * Format: "resource:action"
 * - resource: The entity being accessed (sites, equipment, etc.)
 * - action: The operation (read, write, delete, etc.)
 * - * wildcard: All actions on a resource or all resources
 */

/**
 * All available permissions in the system
 */
export const PERMISSIONS = {
  // Sites
  SITES_READ: 'sites:read',
  SITES_WRITE: 'sites:write',
  SITES_DELETE: 'sites:delete',
  SITES_ALL: 'sites:*',

  // Equipment
  EQUIPMENT_READ: 'equipment:read',
  EQUIPMENT_WRITE: 'equipment:write',
  EQUIPMENT_DELETE: 'equipment:delete',
  EQUIPMENT_ALL: 'equipment:*',

  // Work Orders
  WORK_ORDERS_READ: 'work-orders:read',
  WORK_ORDERS_WRITE: 'work-orders:write',
  WORK_ORDERS_DELETE: 'work-orders:delete',
  WORK_ORDERS_UPDATE_ASSIGNED: 'work-orders:update-assigned',
  WORK_ORDERS_ALL: 'work-orders:*',

  // Photos
  PHOTOS_READ: 'photos:read',
  PHOTOS_CREATE: 'photos:create',
  PHOTOS_DELETE: 'photos:delete',
  PHOTOS_ALL: 'photos:*',

  // Documents
  DOCUMENTS_READ: 'documents:read',
  DOCUMENTS_CREATE: 'documents:create',
  DOCUMENTS_DELETE: 'documents:delete',
  DOCUMENTS_ALL: 'documents:*',

  // Users
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_DELETE: 'users:delete',
  USERS_ALL: 'users:*',

  // Companies (admin only)
  COMPANIES_READ: 'companies:read',
  COMPANIES_WRITE: 'companies:write',
  COMPANIES_ALL: 'companies:*',

  // System (admin only)
  SYSTEM_ALL: '*',
} as const;

/**
 * Role-based permission mapping
 *
 * Defines which permissions each role has by default.
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  /**
   * ADMIN - Full system access
   * Can manage companies, users, and all data
   */
  ADMIN: [PERMISSIONS.SYSTEM_ALL],

  /**
   * MANAGER - Project management
   * Can view and manage sites, equipment, work orders
   * Can view users but not modify them
   * Cannot manage equipment deletion (safety)
   */
  MANAGER: [
    PERMISSIONS.SITES_ALL,
    PERMISSIONS.EQUIPMENT_READ,
    PERMISSIONS.EQUIPMENT_WRITE,
    PERMISSIONS.WORK_ORDERS_ALL,
    PERMISSIONS.PHOTOS_READ,
    PERMISSIONS.PHOTOS_CREATE,
    PERMISSIONS.DOCUMENTS_ALL,
    PERMISSIONS.USERS_READ,
  ],

  /**
   * TECHNICIAN - Field worker
   * Can read sites, create/update equipment
   * Can update assigned work orders
   * Can create photos and documents
   * Cannot delete anything (safety)
   */
  TECHNICIAN: [
    PERMISSIONS.SITES_READ,
    PERMISSIONS.EQUIPMENT_READ,
    PERMISSIONS.EQUIPMENT_WRITE,
    PERMISSIONS.WORK_ORDERS_READ,
    PERMISSIONS.WORK_ORDERS_UPDATE_ASSIGNED,
    PERMISSIONS.PHOTOS_CREATE,
    PERMISSIONS.PHOTOS_READ,
    PERMISSIONS.DOCUMENTS_CREATE,
    PERMISSIONS.DOCUMENTS_READ,
  ],

  /**
   * VIEWER - Read-only access
   * Can view sites, equipment, work orders, photos
   * Cannot modify anything
   */
  VIEWER: [
    PERMISSIONS.SITES_READ,
    PERMISSIONS.EQUIPMENT_READ,
    PERMISSIONS.WORK_ORDERS_READ,
    PERMISSIONS.PHOTOS_READ,
    PERMISSIONS.DOCUMENTS_READ,
  ],
};

/**
 * Get permissions for a given role
 *
 * @param role - User role
 * @returns Array of permission strings
 */
export function getPermissionsForRole(role: UserRole): string[] {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Check if a role has a specific permission
 *
 * Supports wildcard matching:
 * - "sites:*" grants "sites:read", "sites:write", "sites:delete"
 * - "*" grants all permissions
 *
 * @param role - User role
 * @param permission - Permission to check
 * @returns True if role has permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  const rolePermissions = getPermissionsForRole(role);

  // Check for system-wide wildcard
  if (rolePermissions.includes(PERMISSIONS.SYSTEM_ALL)) {
    return true;
  }

  // Check for exact permission match
  if (rolePermissions.includes(permission)) {
    return true;
  }

  // Check for resource wildcard (e.g., "sites:*" matches "sites:read")
  const [resource] = permission.split(':');
  const resourceWildcard = `${resource}:*`;
  if (rolePermissions.includes(resourceWildcard)) {
    return true;
  }

  return false;
}

/**
 * Check if a role has ANY of the specified permissions
 *
 * @param role - User role
 * @param permissions - Array of permissions to check
 * @returns True if role has at least one permission
 */
export function hasAnyPermission(role: UserRole, permissions: string[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has ALL of the specified permissions
 *
 * @param role - User role
 * @param permissions - Array of permissions to check
 * @returns True if role has all permissions
 */
export function hasAllPermissions(role: UserRole, permissions: string[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Get missing permissions for a role
 *
 * @param role - User role
 * @param requiredPermissions - Required permissions
 * @returns Array of missing permissions
 */
export function getMissingPermissions(
  role: UserRole,
  requiredPermissions: string[]
): string[] {
  return requiredPermissions.filter((permission) => !hasPermission(role, permission));
}
