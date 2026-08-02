import * as React from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/cn';

const badgeVariants = cva(
  [
    'inline-flex',
    'items-center',
    'gap-1',
    'rounded-full',
    'px-2.5',
    'py-0.5',
    'text-xs',
    'font-medium',
    'transition-colors',
    'duration-base',
  ],
  {
    variants: {
      variant: {
        default: ['bg-gray-100', 'text-gray-800'],
        primary: ['bg-primary-100', 'text-primary-800'],
        success: ['bg-success-100', 'text-success-800'],
        warning: ['bg-warning-100', 'text-warning-800'],
        danger: ['bg-danger-500', 'text-white'],
        info: ['bg-info-100', 'text-info-800'],
        alpha: ['bg-sector-alpha/10', 'text-sector-alpha'],
        beta: ['bg-sector-beta/10', 'text-sector-beta'],
        gamma: ['bg-sector-gamma/10', 'text-sector-gamma'],
        delta: ['bg-sector-delta/10', 'text-sector-delta'],
      },
      size: {
        sm: ['text-xs', 'px-2', 'py-0.5'],
        md: ['text-sm', 'px-2.5', 'py-1'],
        lg: ['text-base', 'px-3', 'py-1.5'],
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Badge content
   */
  children: React.ReactNode;
  /**
   * Optional icon to display before text
   */
  icon?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Badge Component - Web
 *
 * Small status indicator or label.
 * Implements TowerOS design system badge specifications.
 *
 * @example
 * ```tsx
 * <Badge variant="success">In Service</Badge>
 * <Badge variant="danger">Critical</Badge>
 * <Badge variant="alpha">Sector Alpha</Badge>
 * <Badge variant="primary" icon={<CheckIcon />}>
 *   Completed
 * </Badge>
 * ```
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant, size, icon, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
