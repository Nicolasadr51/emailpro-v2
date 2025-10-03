import React, { memo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useFocusTrap } from '../../hooks';
import { cn } from '../../lib/utils';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  position?: 'left' | 'right';
}

export const MobileDrawer: React.FC<MobileDrawerProps> = memo(({
  isOpen,
  onClose,
  children,
  title,
  position = 'left'
}) => {
  const focusTrapRef = useFocusTrap(isOpen);

  // Empêcher le scroll du body quand le drawer est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const drawerContent = (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={focusTrapRef as React.RefObject<HTMLDivElement>}
        className={cn(
          'fixed top-0 h-full w-80 max-w-[80vw] bg-white dark:bg-gray-800',
          'shadow-xl transform transition-transform duration-300 ease-in-out',
          'border-r border-gray-200 dark:border-gray-700',
          position === 'left' ? 'left-0' : 'right-0'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 
              id="drawer-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              )}
              aria-label="Fermer le menu"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );

  // Utiliser un portal pour rendre le drawer au niveau du body
  return createPortal(drawerContent, document.body);
});

MobileDrawer.displayName = 'MobileDrawer';
