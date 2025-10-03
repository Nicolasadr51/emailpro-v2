import React, { Suspense } from 'react';
import { AppLayout } from './AppLayout';
import { AuthLayout } from './AuthLayout';
import { ErrorLayout, ServerError } from './ErrorLayout';
import { LoadingLayout, PageLoading } from './LoadingLayout';
import { LayoutType } from '../../types/routes';

interface RouteWithLayoutProps {
  layout?: LayoutType;
  element: React.ReactNode;
  loading?: boolean;
  error?: Error;
  resetError?: () => void;
}

export const RouteWithLayout: React.FC<RouteWithLayoutProps> = ({
  layout = 'app',
  element,
  loading = false,
  error,
  resetError
}) => {
  // Gestion des erreurs
  if (error) {
    return <ServerError error={error} resetError={resetError} />;
  }

  // Gestion du chargement
  if (loading) {
    return <LoadingLayout message="Chargement de la page..." />;
  }

  // Wrapper avec Suspense pour le lazy loading
  const WrappedElement = (
    <Suspense fallback={<PageLoading />}>
      {element}
    </Suspense>
  );

  // Sélection du layout
  switch (layout) {
    case 'app':
      return <AppLayout>{WrappedElement}</AppLayout>;
      
    case 'auth':
      return <AuthLayout>{WrappedElement}</AuthLayout>;
      
    case 'error':
      return <ErrorLayout>{WrappedElement}</ErrorLayout>;
      
    case 'loading':
      return <LoadingLayout />;
      
    default:
      return <>{WrappedElement}</>;
  }
};

RouteWithLayout.displayName = 'RouteWithLayout';
