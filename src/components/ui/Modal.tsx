import React, { useEffect, memo } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useFocusTrap, useKeyboardShortcuts } from '../../hooks';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4'
};

export const Modal: React.FC<ModalProps> = memo(({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  overlayClassName
}) => {
  // Utiliser le hook de focus trap
  const focusTrapRef = useFocusTrap(isOpen);
  
  // Utiliser le hook de raccourcis clavier
  useKeyboardShortcuts({
    'escape': closeOnEscape ? onClose : () => {}
  });

  // Gestion du scroll du body
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

  // Gestion du clic sur l'overlay
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-black/50 backdrop-blur-sm',
        'animate-fade-in',
        overlayClassName
      )}
      onClick={handleOverlayClick}
    >
      <div
        ref={focusTrapRef as React.RefObject<HTMLDivElement>}
        className={cn(
          'relative w-full bg-white rounded-lg shadow-xl',
          'dark:bg-gray-800 dark:border dark:border-gray-700',
          'animate-scale-in',
          'max-h-[90vh] overflow-hidden flex flex-col',
          sizeClasses[size],
          className
        )}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1">
              {title && (
                <h2 
                  id="modal-title"
                  className="text-lg font-semibold text-gray-900 dark:text-white"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p 
                  id="modal-description"
                  className="mt-1 text-sm text-gray-600 dark:text-gray-400"
                >
                  {description}
                </p>
              )}
            </div>
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Fermer la modal"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

// Composants pour structurer le contenu de la modal
export const ModalHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn('pb-4 border-b border-gray-200 dark:border-gray-700', className)}>
    {children}
  </div>
);

export const ModalBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn('py-4', className)}>
    {children}
  </div>
);

export const ModalFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div className={cn('pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-2', className)}>
    {children}
  </div>
);
