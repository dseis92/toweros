import * as React from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/cn';

const buttonVariants = cva(
  [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'rounded-base',
    'font-medium',
    'transition-all',
    'duration-base',
    'focus-visible:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary-500',
          'text-white',
          'hover:bg-primary-600',
          'active:bg-primary-700',
          'focus-visible:ring-primary-500',
        ],
        secondary: [
          'bg-gray-100',
          'text-gray-900',
          'hover:bg-gray-200',
          'active:bg-gray-300',
          'focus-visible:ring-gray-500',
        ],
        tertiary: [
          'bg-transparent',
          'text-primary-500',
          'hover:bg-primary-50',
          'active:bg-primary-100',
          'focus-visible:ring-primary-500',
        ],
        danger: [
          'bg-danger-500',
          'text-white',
          'hover:bg-danger-600',
          'active:bg-danger-700',
          'focus-visible:ring-danger-500',
        ],
        ghost: [
          'bg-transparent',
          'hover:bg-gray-100',
          'active:bg-gray-200',
          'focus-visible:ring-gray-500',
        ],
      },
      size: {
        sm: ['h-8', 'px-3', 'text-sm'],
        md: ['h-10', 'px-4', 'text-base'],
        lg: ['h-12', 'px-6', 'text-lg'],
      },
      fullWidth: {
        true: 'w-full',
      },
      loading: {
        true: 'cursor-wait',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Button content
   */
  children: React.ReactNode;
  /**
   * Optional icon to display before the button text
   */
  iconLeft?: React.ReactNode;
  /**
   * Optional icon to display after the button text
   */
  iconRight?: React.ReactNode;
  /**
   * Loading state - shows spinner and disables button
   */
  loading?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Button Component - Web
 *
 * Primary interactive element for user actions.
 * Implements TowerOS design system button specifications.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Install Equipment
 * </Button>
 *
 * <Button variant="danger" loading={isDeleting}>
 *   Delete Site
 * </Button>
 *
 * <Button variant="tertiary" iconLeft={<PlusIcon />}>
 *   Add Photo
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant,
      size,
      fullWidth,
      loading,
      iconLeft,
      iconRight,
      className,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, fullWidth, loading }), className)}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && iconLeft && <span className="shrink-0">{iconLeft}</span>}
        <span>{children}</span>
        {!loading && iconRight && <span className="shrink-0">{iconRight}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
