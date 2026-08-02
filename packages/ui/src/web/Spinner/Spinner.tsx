import * as React from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/cn';

const spinnerVariants = cva(['animate-spin', 'rounded-full', 'border-solid'], {
  variants: {
    size: {
      sm: ['h-4', 'w-4', 'border-2'],
      md: ['h-8', 'w-8', 'border-2'],
      lg: ['h-12', 'w-12', 'border-3'],
      xl: ['h-16', 'w-16', 'border-4'],
    },
    variant: {
      primary: [
        'border-primary-500',
        'border-t-transparent',
      ],
      white: [
        'border-white',
        'border-t-transparent',
      ],
      gray: [
        'border-gray-300',
        'border-t-transparent',
      ],
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'primary',
  },
});

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Accessible label for screen readers
   */
  label?: string;
}

/**
 * Spinner Component - Web
 *
 * Loading indicator for async operations.
 * Implements TowerOS design system loading state specifications.
 *
 * @example
 * ```tsx
 * <Spinner size="md" variant="primary" label="Loading..." />
 *
 * <Spinner size="sm" variant="white" label="Syncing..." />
 * ```
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size, variant, className, label = 'Loading...', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn('inline-block', className)}
        {...props}
      >
        <div className={cn(spinnerVariants({ size, variant }))} />
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';
