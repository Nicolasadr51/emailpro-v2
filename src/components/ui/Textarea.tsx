import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// Variants du textarea
const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 dark:placeholder:text-gray-400 dark:focus-visible:ring-primary-400',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-error-500 focus-visible:ring-error-500 dark:border-error-400 dark:focus-visible:ring-error-400'
      },
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize'
      }
    },
    defaultVariants: {
      variant: 'default',
      resize: 'vertical'
    }
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className,
    containerClassName,
    variant,
    resize,
    label,
    error,
    helperText,
    maxLength,
    showCharCount = false,
    id,
    value,
    ...props 
  }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const finalVariant = hasError ? 'error' : variant;
    
    const currentLength = typeof value === 'string' ? value.length : 0;

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label 
            htmlFor={textareaId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          <textarea
            id={textareaId}
            className={cn(textareaVariants({ variant: finalVariant, resize }), className)}
            ref={ref}
            maxLength={maxLength}
            value={value}
            {...props}
          />
          
          {showCharCount && maxLength && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-1 rounded">
              {currentLength}/{maxLength}
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-start">
          {(error || helperText) && (
            <p className={cn(
              'text-sm',
              hasError 
                ? 'text-error-600 dark:text-error-400' 
                : 'text-gray-600 dark:text-gray-400'
            )}>
              {error || helperText}
            </p>
          )}
          
          {showCharCount && maxLength && !error && !helperText && (
            <p className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };
