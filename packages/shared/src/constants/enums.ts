/**
 * Shared Enums
 *
 * These enums match the database schema exactly
 */

export const Carrier = {
  ATT: 'ATT',
  VERIZON: 'VERIZON',
  TMOBILE: 'TMOBILE',
  DISH: 'DISH',
  US_CELLULAR: 'US_CELLULAR',
  OTHER: 'OTHER',
} as const

export type Carrier = (typeof Carrier)[keyof typeof Carrier]

export const SiteType = {
  MONOPOLE: 'MONOPOLE',
  LATTICE_TOWER: 'LATTICE_TOWER',
  GUYED_TOWER: 'GUYED_TOWER',
  ROOFTOP: 'ROOFTOP',
  WATER_TANK: 'WATER_TANK',
  SMALL_CELL: 'SMALL_CELL',
  DAS: 'DAS',
} as const

export type SiteType = (typeof SiteType)[keyof typeof SiteType]

export const SiteStatus = {
  PLANNED: 'PLANNED',
  PERMITTING: 'PERMITTING',
  CONSTRUCTION: 'CONSTRUCTION',
  TESTING: 'TESTING',
  INSPECTION: 'INSPECTION',
  PUNCH_LIST: 'PUNCH_LIST',
  ACCEPTED: 'ACCEPTED',
  ON_AIR: 'ON_AIR',
  MAINTENANCE: 'MAINTENANCE',
  DECOMMISSIONED: 'DECOMMISSIONED',
} as const

export type SiteStatus = (typeof SiteStatus)[keyof typeof SiteStatus]

export const EquipmentType = {
  ANTENNA: 'ANTENNA',
  RADIO_RRU: 'RADIO_RRU',
  RADIO_BBU: 'RADIO_BBU',
  RET: 'RET',
  HYBRID_CABLE: 'HYBRID_CABLE',
  FIBER_CABLE: 'FIBER_CABLE',
  COAX_CABLE: 'COAX_CABLE',
  POWER_CABLE: 'POWER_CABLE',
  RECTIFIER: 'RECTIFIER',
  BATTERY: 'BATTERY',
  BREAKER: 'BREAKER',
  GROUNDING_KIT: 'GROUNDING_KIT',
  MOUNT: 'MOUNT',
  BRACKET: 'BRACKET',
  CABINET: 'CABINET',
  MICROWAVE_DISH: 'MICROWAVE_DISH',
  GPS_ANTENNA: 'GPS_ANTENNA',
  JUMPER: 'JUMPER',
  SURGE_PROTECTOR: 'SURGE_PROTECTOR',
} as const

export type EquipmentType = (typeof EquipmentType)[keyof typeof EquipmentType]

export const EquipmentStatus = {
  ORDERED: 'ORDERED',
  RECEIVED: 'RECEIVED',
  STAGED: 'STAGED',
  INSTALLED: 'INSTALLED',
  TESTED: 'TESTED',
  IN_SERVICE: 'IN_SERVICE',
  FAILED: 'FAILED',
  REMOVED: 'REMOVED',
} as const

export type EquipmentStatus = (typeof EquipmentStatus)[keyof typeof EquipmentStatus]

export const WorkOrderStatus = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  ASSIGNED: 'ASSIGNED',
  MOBILIZED: 'MOBILIZED',
  IN_PROGRESS: 'IN_PROGRESS',
  ON_HOLD: 'ON_HOLD',
  TESTING: 'TESTING',
  INSPECTION: 'INSPECTION',
  PUNCH_LIST: 'PUNCH_LIST',
  COMPLETED: 'COMPLETED',
  ACCEPTED: 'ACCEPTED',
  CANCELLED: 'CANCELLED',
} as const

export type WorkOrderStatus = (typeof WorkOrderStatus)[keyof typeof WorkOrderStatus]

export const TaskStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  BLOCKED: 'BLOCKED',
  COMPLETED: 'COMPLETED',
  SKIPPED: 'SKIPPED',
} as const

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]

export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  COMPANY_ADMIN: 'COMPANY_ADMIN',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
  FOREMAN: 'FOREMAN',
  TECHNICIAN: 'TECHNICIAN',
  INSPECTOR: 'INSPECTOR',
  CLIENT: 'CLIENT',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const PhotoCategory = {
  SITE_OVERVIEW: 'SITE_OVERVIEW',
  EQUIPMENT_INSTALLED: 'EQUIPMENT_INSTALLED',
  EQUIPMENT_CLOSEUP: 'EQUIPMENT_CLOSEUP',
  BEFORE: 'BEFORE',
  AFTER: 'AFTER',
  INSPECTION_FINDING: 'INSPECTION_FINDING',
  SAFETY_ISSUE: 'SAFETY_ISSUE',
  TEST_RESULT: 'TEST_RESULT',
  LABEL: 'LABEL',
  DOCUMENTATION: 'DOCUMENTATION',
  DAMAGE: 'DAMAGE',
  OTHER: 'OTHER',
} as const

export type PhotoCategory = (typeof PhotoCategory)[keyof typeof PhotoCategory]
