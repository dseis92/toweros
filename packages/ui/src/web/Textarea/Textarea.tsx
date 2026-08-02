import * as React from 'react';
import { cn } from '../../lib/cn';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Label text displayed above textarea
   */
  label?: string;
  /**
   * Helper text displayed below textarea
   */
  helperText?: string;
  /**
   * Error message - displays in red below textarea
   */
  error?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether the textarea is required (adds asterisk to label)
   */
  required?: boolean;
}

/**
 * Textarea Component - Web
 *
 * Multi-line text input with label and validation states.
 * Implements TowerOS design system textarea specifications.
 *
 * @example
 * ```tsx
 * <Textarea
 *   label="Installation Notes"
 *   placeholder="Enter notes..."
 *   rows={4}
 * />
 *
 * <Textarea
 *   label="Description"
 *   error="Description is required"
 *   required
 * />
 * ```
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      className,
      required,
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaId = id || React.useId();
    const helperTextId = `${textareaId}-helper`;
    const errorId = `${textareaId}-error`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            'w-full',
            'rounded-base',
            'border',
            'bg-white',
            'px-4',
            'py-3',
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
            'resize-vertical',
            error
              ? [
                  'border-danger-500',
                  'focus:border-danger-500',
                  'focus:ring-danger-500',
                ]
              : [
                  'border-gray-300',
                  'focus:border-primary-500',
                  'focus:ring-primary-500',
                ],
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? errorId : helperText ? helperTextId : undefined
          }
          {...props}
        />

        {error && (
          <p id={errorId} className="mt-1 text-sm text-danger-500" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p id={helperTextId} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
