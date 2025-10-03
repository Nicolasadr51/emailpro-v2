import React, { memo } from 'react';
import { Breadcrumb } from './Breadcrumb';
import { cn } from '../../lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface PageWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
  showBreadcrumbs?: boolean;
}

export const PageWrapper: React.FC<PageWrapperProps> = memo(({
  children,
  title,
  description,
  breadcrumbs,
  actions,
  className,
  showBreadcrumbs = true
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header Section */}
      {(title || showBreadcrumbs || actions) && (
        <div className="space-y-4">
          {/* Breadcrumbs */}
          {showBreadcrumbs && (
            <Breadcrumb items={breadcrumbs} />
          )}
          
          {/* Title and Actions */}
          {(title || actions) && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                {title && (
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {description}
                  </p>
                )}
              </div>
              
              {actions && (
                <div className="flex items-center space-x-3">
                  {actions}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Content */}
      <div>
        {children}
      </div>
    </div>
  );
});

PageWrapper.displayName = 'PageWrapper';
