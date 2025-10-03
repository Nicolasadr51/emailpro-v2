import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { ElementType } from '../../features/email-editor/types/editor.types';

interface LoadingSkeletonProps {
  className?: string;
  variant?: ElementType | 'card' | 'avatar' | 'table';
  lines?: number;
  width?: string;
  height?: string;
  animate?: boolean;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  variant = 'TEXT',
  lines = 1,
  width,
  height,
  animate = true
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700 rounded';
  
  const pulseAnimation = animate ? {
    animate: {
      opacity: [0.5, 1, 0.5],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  } : {};

  const SkeletonElement = animate ? motion.div : 'div';

  const renderSkeleton = () => {
    switch (variant) {
      case 'TEXT':
        return (
          <div className={cn('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, index) => (
              <SkeletonElement
                key={index}
                className={cn(
                  baseClasses,
                  'h-4',
                  index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
                )}
                style={{ width, height }}
                {...pulseAnimation}
              />
            ))}
          </div>
        );

      case 'card':
        return (
          <div className={cn('p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4', className)}>
            <SkeletonElement
              className={cn(baseClasses, 'h-48 w-full')}
              {...pulseAnimation}
            />
            <div className="space-y-2">
              <SkeletonElement
                className={cn(baseClasses, 'h-6 w-3/4')}
                {...pulseAnimation}
              />
              <SkeletonElement
                className={cn(baseClasses, 'h-4 w-full')}
                {...pulseAnimation}
              />
              <SkeletonElement
                className={cn(baseClasses, 'h-4 w-2/3')}
                {...pulseAnimation}
              />
            </div>
          </div>
        );

      case 'avatar':
        return (
          <SkeletonElement
            className={cn(baseClasses, 'w-10 h-10 rounded-full', className)}
            style={{ width, height }}
            {...pulseAnimation}
          />
        );

      case 'BUTTON':
        return (
          <SkeletonElement
            className={cn(baseClasses, 'h-10 w-24', className)}
            style={{ width, height }}
            {...pulseAnimation}
          />
        );

      case 'table':
        return (
          <div className={cn('space-y-3', className)}>
            {/* Header */}
            <div className="flex space-x-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonElement
                  key={index}
                  className={cn(baseClasses, 'h-4 flex-1')}
                  {...pulseAnimation}
                />
              ))}
            </div>
            {/* Rows */}
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className="flex space-x-4">
                {Array.from({ length: 4 }).map((_, colIndex) => (
                  <SkeletonElement
                    key={colIndex}
                    className={cn(baseClasses, 'h-6 flex-1')}
                    {...pulseAnimation}
                  />
                ))}
              </div>
            ))}
          </div>
        );

      default:
        return (
          <SkeletonElement
            className={cn(baseClasses, 'h-4 w-full', className)}
            style={{ width, height }}
            {...pulseAnimation}
          />
        );
    }
  };

  return renderSkeleton();
};

// Composants spécialisés
export const CampaignCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSkeleton variant="card" className={className} />
);

export const CampaignTableSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <LoadingSkeleton variant="table" className={className} />
);

export const DashboardStatsSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <LoadingSkeleton width="80px" height="16px" />
            <LoadingSkeleton width="60px" height="32px" />
            <LoadingSkeleton width="50px" height="14px" />
          </div>
          <LoadingSkeleton variant="avatar" width="48px" height="48px" />
        </div>
      </div>
    ))}
  </div>
);

export const EmailEditorSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex h-screen', className)}>
    {/* Sidebar */}
    <div className="w-64 p-4 border-r border-gray-200 dark:border-gray-700 space-y-4">
      <LoadingSkeleton width="120px" height="24px" />
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
          <LoadingSkeleton variant="avatar" width="32px" height="32px" />
          <div className="flex-1 space-y-1">
            <LoadingSkeleton width="80px" height="14px" />
            <LoadingSkeleton width="120px" height="12px" />
          </div>
        </div>
      ))}
    </div>
    
    {/* Main content */}
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <LoadingSkeleton lines={Math.floor(Math.random() * 3) + 1} />
          </div>
        ))}
      </div>
    </div>
    
    {/* Properties panel */}
    <div className="w-80 p-4 border-l border-gray-200 dark:border-gray-700 space-y-6">
      <LoadingSkeleton width="100px" height="20px" />
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <LoadingSkeleton width="60px" height="14px" />
          <LoadingSkeleton height="40px" />
        </div>
      ))}
    </div>
  </div>
);
