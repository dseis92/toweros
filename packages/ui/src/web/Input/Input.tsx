import * as React from 'react';
import { cva, type VariantProps } from '../../lib/cva';
import { cn } from '../../lib/cn';

const inputVariants = cva(
  [
    'w-full',
    'rounded-base',
    'border',
    'bg-white',
    'px-4',
    'text-base',
    'transition-colors',
    'duration-base',
    'placeholder:text-gray-400',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-0',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
    'disabled:bg-gray-50',
  ],
  {
    variants: {
      state: {
        default: [
          'border-gray-300',
          'focus:border-primary-500',
          'focus:ring-primary-500',
        ],
        error: [
          'border-danger-500',
          'focus:border-danger-500',
          'focus:ring-danger-500',
        ],
        success: [
          'border-success-500',
          'focus:border-success-500',
          'focus:ring-success-500',
        ],
      },
      size: {
        sm: ['h-8', 'text-sm'],
        md: ['h-10', 'text-base'],
        lg: ['h-12', 'text-lg'],
      },
    },
    defaultVariants: {
      state: 'default',
      size: 'md',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  /**
   * Label text displayed above input
   */
  label?: string;
  /**
   * Helper text displayed below input
   */
  helperText?: string;
  /**
   * Error message - automatically sets state to error
   */
  error?: string;
  /**
   * Success message - automatically sets state to success
   */
  success?: string;
  /**
   * Icon to display on the left side of input
   */
  iconLeft?: React.ReactNode;
  /**
   * Icon to display on the right side of input
   */
  iconRight?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether the input is required (adds asterisk to label)
   */
  required?: boolean;
}

/**
 * Input Component - Web
 *
 * Text input field with label, helper text, and validation states.
 * Implements TowerOS design system input specifications.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Site Name"
 *   placeholder="Enter site name"
 *   required
 * />
 *
 * <Input
 *   label="Email"
 *   type="email"
 *   error="Invalid email address"
 * />
 *
 * <Input
 *   label="Search"
 *   iconLeft={<SearchIcon />}
 *   placeholder="Search equipment..."
 * />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      success,
      iconLeft,
      iconRight,
      state,
      size,
      className,
      required,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    const helperTextId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const computedState = error ? 'error' : success ? 'success' : state;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {iconLeft && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {iconLeft}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              inputVariants({ state: computedState, size }),
              iconLeft && 'pl-10',
              iconRight && 'pr-10',
              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? errorId : helperText ? helperTextId : undefined
            }
            {...props}
          />

          {iconRight && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {iconRight}
            </div>
          )}
        </div>

        {error && (
          <p id={errorId} className="mt-1 text-sm text-danger-500" role="alert">
            {error}
          </p>
        )}

        {success && !error && (
          <p className="mt-1 text-sm text-success-500">{success}</p>
        )}

        {helperText && !error && !success && (
          <p id={helperTextId} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
