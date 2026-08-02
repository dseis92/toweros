/**
 * Site Validation Schemas
 */

import { z } from 'zod'
import { Carrier, SiteType, SiteStatus } from '@tower/shared'

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'State must be 2 characters'),
  zip: z.string().regex(/^\d{5}$/, 'ZIP code must be 5 digits'),
  country: z.string().default('USA'),
})

export const createSiteSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  siteCode: z.string().optional(),
  carrier: z.nativeEnum(Carrier),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: addressSchema,
  siteType: z.nativeEnum(SiteType),
  towerHeightFt: z.number().positive().optional(),
  elevationFt: z.number().optional(),
})

export const updateSiteSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  status: z.nativeEnum(SiteStatus).optional(),
  constructionStart: z.string().datetime().optional(),
  onAirDate: z.string().date().optional(),
  towerHeightFt: z.number().positive().optional(),
  elevationFt: z.number().optional(),
})

export const siteQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  status: z.nativeEnum(SiteStatus).optional(),
  carrier: z.nativeEnum(Carrier).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'createdAt', 'status']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  include: z.string().optional(), // Comma-separated: "sectors,equipment,workOrders"
})

export const siteNearbyQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce.number().positive().default(50),
  limit: z.coerce.number().int().positive().default(10),
})

// Type exports
export type CreateSiteInput = z.infer<typeof createSiteSchema>
export type UpdateSiteInput = z.infer<typeof updateSiteSchema>
export type SiteQueryInput = z.infer<typeof siteQuerySchema>
export type SiteNearbyQueryInput = z.infer<typeof siteNearbyQuerySchema>
