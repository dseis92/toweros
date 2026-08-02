import { cva as clasVarianceAuthority } from 'class-variance-authority';

/**
 * Re-export class-variance-authority for component variants
 * Used to create type-safe component variant systems
 */
export const cva = clasVarianceAuthority;
export type { VariantProps } from 'class-variance-authority';
