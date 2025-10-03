import React, { memo } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '../ui';

interface ErrorLayoutProps {
  children: React.ReactNode;
  error?: Error;
  resetError?: () => void;
}

export const ErrorLayout: React.FC<ErrorLayoutProps> = memo(({ 
  children, 
  error, 
  resetError 
}) => {
  const handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  const handleRefresh = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icône d'erreur */}
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>

        {/* Contenu de l'erreur */}
        <div className="mb-8">
          {children}
        </div>

        {/* Détails de l'erreur en mode développement */}
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 mb-2">
              Détails de l'erreur (développement)
            </summary>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-xs font-mono text-gray-800 dark:text-gray-200 overflow-auto max-h-32">
              <div className="font-semibold mb-2">{error.name}: {error.message}</div>
              {error.stack && (
                <pre className="whitespace-pre-wrap">{error.stack}</pre>
              )}
            </div>
          </details>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleRefresh}
            leftIcon={<RefreshCw className="w-4 h-4" />}
            variant="outline"
          >
            Réessayer
          </Button>
          
          <Button
            onClick={handleGoHome}
            leftIcon={<Home className="w-4 h-4" />}
          >
            Retour à l'accueil
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Si le problème persiste, contactez le support technique.</p>
        </div>
      </div>
    </div>
  );
});

ErrorLayout.displayName = 'ErrorLayout';

// Composant pour les erreurs 404
export const NotFoundError: React.FC = () => (
  <ErrorLayout>
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
      404
    </h1>
    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
      Page non trouvée
    </h2>
    <p className="text-gray-600 dark:text-gray-400">
      La page que vous recherchez n'existe pas ou a été déplacée.
    </p>
  </ErrorLayout>
);

// Composant pour les erreurs 500
export const ServerError: React.FC<{ error?: Error; resetError?: () => void }> = ({ 
  error, 
  resetError 
}) => (
  <ErrorLayout error={error} resetError={resetError}>
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
      500
    </h1>
    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
      Erreur interne du serveur
    </h2>
    <p className="text-gray-600 dark:text-gray-400">
      Une erreur inattendue s'est produite. Veuillez réessayer dans quelques instants.
    </p>
  </ErrorLayout>
);

// Composant pour les erreurs de réseau
export const NetworkError: React.FC<{ resetError?: () => void }> = ({ resetError }) => (
  <ErrorLayout resetError={resetError}>
    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
      Hors ligne
    </h1>
    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
      Problème de connexion
    </h2>
    <p className="text-gray-600 dark:text-gray-400">
      Vérifiez votre connexion internet et réessayez.
    </p>
  </ErrorLayout>
);
