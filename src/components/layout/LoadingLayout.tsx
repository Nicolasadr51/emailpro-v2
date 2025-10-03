import React, { memo } from 'react';
import { Loader2, Mail } from 'lucide-react';

interface LoadingLayoutProps {
  message?: string;
  showLogo?: boolean;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingLayout: React.FC<LoadingLayoutProps> = memo(({
  message = 'Chargement...',
  showLogo = true,
  fullScreen = true,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = fullScreen 
    ? 'min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Logo */}
        {showLogo && (
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
              EmailPro
            </h1>
          </div>
        )}

        {/* Spinner */}
        <div className="mb-4">
          <Loader2 className={`${sizeClasses[size]} animate-spin mx-auto text-primary-600 dark:text-primary-400`} />
        </div>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {message}
        </p>

        {/* Points de chargement animés */}
        <div className="flex justify-center mt-4 space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

LoadingLayout.displayName = 'LoadingLayout';

// Composant pour le chargement des pages
export const PageLoading: React.FC<{ message?: string }> = ({ 
  message = 'Chargement de la page...' 
}) => (
  <LoadingLayout 
    message={message} 
    showLogo={false} 
    fullScreen={false} 
    size="md" 
  />
);

// Composant pour le chargement des données
export const DataLoading: React.FC<{ message?: string }> = ({ 
  message = 'Chargement des données...' 
}) => (
  <LoadingLayout 
    message={message} 
    showLogo={false} 
    fullScreen={false} 
    size="sm" 
  />
);

// Composant pour le chargement initial de l'app
export const AppLoading: React.FC = () => (
  <LoadingLayout 
    message="Initialisation d'EmailPro..." 
    showLogo={true} 
    fullScreen={true} 
    size="lg" 
  />
);

// Hook pour gérer les états de chargement
export const useLoadingStates = () => {
  const [loadingStates, setLoadingStates] = React.useState<Record<string, boolean>>({});

  const setLoading = React.useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading
    }));
  }, []);

  const isLoading = React.useCallback((key: string) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = React.useCallback(() => {
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  return {
    setLoading,
    isLoading,
    isAnyLoading,
    loadingStates
  };
};
