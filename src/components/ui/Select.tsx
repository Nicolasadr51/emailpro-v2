import React, { forwardRef, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// Variants du select
const selectVariants = cva(
  'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:ring-offset-gray-900 dark:placeholder:text-gray-400 dark:focus:ring-primary-400',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-error-500 focus:ring-error-500 dark:border-error-400 dark:focus:ring-error-400'
      },
      size: {
        default: 'h-10',
        sm: 'h-9 px-2 text-xs',
        lg: 'h-11 px-4'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
  children?: React.ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className,
    containerClassName,
    variant,
    size,
    label,
    error,
    helperText,
    options = [],
    children,
    placeholder = 'Sélectionner...',
    id,
    ...props 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(props.value || '');
    
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const finalVariant = hasError ? 'error' : variant;
    
    const selectedOption = options.find(option => option.value === selectedValue);

    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return;
      
      setSelectedValue(option.value);
      setIsOpen(false);
      
      // Déclencher l'événement onChange
      if (props.onChange) {
        const event = {
          target: { value: option.value }
        } as React.ChangeEvent<HTMLSelectElement>;
        props.onChange(event);
      }
    };

    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label 
            htmlFor={selectId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {children ? (
            /* Mode children - Select natif visible */
            <select
              ref={ref}
              id={selectId}
              className={cn(selectVariants({ variant: finalVariant, size }), className)}
              {...props}
            >
              {placeholder && <option value="">{placeholder}</option>}
              {children}
            </select>
          ) : (
            /* Mode options - Interface personnalisée */
            <>
              <select
                ref={ref}
                id={selectId}
                className="sr-only"
                value={selectedValue}
                {...props}
              >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              
              <button
                type="button"
                className={cn(selectVariants({ variant: finalVariant, size }), className)}
                onClick={() => setIsOpen(!isOpen)}
                disabled={props.disabled}
              >
                <span className={cn(
                  'block truncate',
                  !selectedOption && 'text-gray-500 dark:text-gray-400'
                )}>
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={cn(
                  'h-4 w-4 transition-transform',
                  isOpen && 'rotate-180'
                )} />
              </button>
              
              {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-600">
                  <div className="py-1 max-h-60 overflow-auto">
                    {options.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={cn(
                          'relative w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between',
                          option.disabled && 'opacity-50 cursor-not-allowed',
                          selectedValue === option.value && 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        )}
                        onClick={() => handleSelect(option)}
                        disabled={option.disabled}
                      >
                        <span className="block truncate">{option.label}</span>
                        {selectedValue === option.value && (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
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
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select, selectVariants };
