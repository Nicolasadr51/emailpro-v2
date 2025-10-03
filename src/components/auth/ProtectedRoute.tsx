import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'admin' | 'user';
  requiredSubscription?: 'free' | 'pro' | 'enterprise';
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredRole,
  requiredSubscription,
  fallback
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si l'authentification est requise
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to="/auth/login" 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  // Vérifier le rôle requis
  if (requiredRole && user && user.role !== requiredRole) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Accès non autorisé
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
        </div>
      </div>
    );
  }

  // Vérifier l'abonnement requis
  if (requiredSubscription && user) {
    const subscriptionLevels = { free: 0, pro: 1, enterprise: 2 };
    const userLevel = subscriptionLevels[user.subscription];
    const requiredLevel = subscriptionLevels[requiredSubscription];
    
    if (userLevel < requiredLevel) {
      if (fallback) {
        return <>{fallback}</>;
      }
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Mise à niveau requise
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Cette fonctionnalité nécessite un abonnement {requiredSubscription}.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Mettre à niveau
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

// Composant pour rediriger les utilisateurs connectés
interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = '/dashboard'
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
