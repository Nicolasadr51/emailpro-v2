import React, { forwardRef } from 'react';
import { Check, Minus } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// Variants du checkbox
const checkboxVariants = cva(
  'peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary-600 data-[state=checked]:text-white data-[state=checked]:border-primary-600 dark:border-gray-600 dark:ring-offset-gray-900 dark:focus-visible:ring-primary-400 dark:data-[state=checked]:bg-primary-600 dark:data-[state=checked]:border-primary-600',
  {
    variants: {
      size: {
        default: 'h-4 w-4',
        sm: 'h-3 w-3',
        lg: 'h-5 w-5'
      }
    },
    defaultVariants: {
      size: 'default'
    }
  }
);

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof checkboxVariants> {
  label?: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
  containerClassName?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ 
    className,
    containerClassName,
    size,
    label,
    description,
    error,
    indeterminate = false,
    checked,
    id,
    ...props 
  }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;

    return (
      <div className={cn('space-y-2', containerClassName)}>
        <div className="flex items-start space-x-2">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              id={checkboxId}
              ref={ref}
              className={cn(
                checkboxVariants({ size }),
                'absolute opacity-0 cursor-pointer',
                className
              )}
              checked={checked}
              data-state={indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked'}
              {...props}
            />
            
            {/* Checkbox visuel personnalisé */}
            <div className={cn(
              checkboxVariants({ size }),
              'flex items-center justify-center transition-colors',
              checked || indeterminate ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white dark:bg-gray-800',
              hasError && 'border-error-500 dark:border-error-400',
              props.disabled && 'opacity-50 cursor-not-allowed'
            )}>
              {indeterminate ? (
                <Minus className={cn(
                  size === 'sm' && 'h-2 w-2',
                  size === 'default' && 'h-3 w-3',
                  size === 'lg' && 'h-4 w-4'
                )} />
              ) : checked ? (
                <Check className={cn(
                  size === 'sm' && 'h-2 w-2',
                  size === 'default' && 'h-3 w-3',
                  size === 'lg' && 'h-4 w-4'
                )} />
              ) : null}
            </div>
          </div>
          
          {(label || description) && (
            <div className="flex-1 space-y-1">
              {label && (
                <label 
                  htmlFor={checkboxId}
                  className={cn(
                    'text-sm font-medium leading-none cursor-pointer',
                    props.disabled && 'cursor-not-allowed opacity-70',
                    hasError ? 'text-error-600 dark:text-error-400' : 'text-gray-700 dark:text-gray-300'
                  )}
                >
                  {label}
                </label>
              )}
              
              {description && (
                <p className={cn(
                  'text-sm',
                  hasError ? 'text-error-600 dark:text-error-400' : 'text-gray-600 dark:text-gray-400'
                )}>
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-error-600 dark:text-error-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox, checkboxVariants };
