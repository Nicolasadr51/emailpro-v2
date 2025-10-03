import React, { memo } from 'react';
import { useLoading } from '../../store/useAppStore';

export const LoadingOverlay: React.FC = memo(() => {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Chargement...
            </h3>
            {loadingMessage && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {loadingMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

LoadingOverlay.displayName = 'LoadingOverlay';
