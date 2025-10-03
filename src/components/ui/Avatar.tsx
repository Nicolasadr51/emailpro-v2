import React, { forwardRef, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// Variants de l'avatar
const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
        '2xl': 'h-20 w-20'
      }
    },
    defaultVariants: {
      size: 'default'
    }
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
  name?: string;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, name, ...props }, ref) => {
    const [imageError, setImageError] = useState(false);
    
    // Générer les initiales à partir du nom
    const getInitials = (name: string): string => {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };
    
    const displayFallback = fallback || (name ? getInitials(name) : '?');
    const shouldShowImage = src && !imageError;

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {shouldShowImage ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            <span className={cn(
              'font-medium',
              size === 'sm' && 'text-xs',
              size === 'default' && 'text-sm',
              size === 'lg' && 'text-base',
              size === 'xl' && 'text-lg',
              size === '2xl' && 'text-xl'
            )}>
              {displayFallback}
            </span>
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar, avatarVariants };
