import React, { createContext, useContext } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Contexte pour exposer des méthodes utilitaires
interface QueryContextType {
  invalidateQueries: (queryKey: string[]) => Promise<void>;
  prefetchQuery: (queryKey: string[], fn: () => Promise<any>) => Promise<void>;
  removeQueries: (queryKey: string[]) => void;
  resetQueries: (queryKey: string[]) => Promise<void>;
}

const QueryContext = createContext<QueryContextType | undefined>(undefined);

// Configuration du client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Temps de cache par défaut
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Temps avant garbage collection
      gcTime: 10 * 60 * 1000, // 10 minutes (anciennement cacheTime)
      // Retry automatique
      retry: (failureCount, error: any) => {
        // Ne pas retry sur les erreurs 4xx
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry jusqu'à 3 fois pour les autres erreurs
        return failureCount < 3;
      },
      // Délai entre les retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch en arrière-plan quand la fenêtre reprend le focus
      refetchOnWindowFocus: false,
      // Refetch quand la connexion est rétablie
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry automatique pour les mutations
      retry: (failureCount, error: any) => {
        // Ne pas retry sur les erreurs 4xx
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry jusqu'à 2 fois pour les autres erreurs
        return failureCount < 2;
      },
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  // Méthodes utilitaires du contexte
  const contextValue: QueryContextType = {
    invalidateQueries: async (queryKey: string[]) => {
      await queryClient.invalidateQueries({ queryKey });
    },
    
    prefetchQuery: async (queryKey: string[], fn: () => Promise<any>) => {
      await queryClient.prefetchQuery({
        queryKey,
        queryFn: fn,
      });
    },
    
    removeQueries: (queryKey: string[]) => {
      queryClient.removeQueries({ queryKey });
    },
    
    resetQueries: async (queryKey: string[]) => {
      await queryClient.resetQueries({ queryKey });
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <QueryContext.Provider value={contextValue}>
        {children}
        {/* DevTools uniquement en développement */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools 
            initialIsOpen={false}
          />
        )}
      </QueryContext.Provider>
    </QueryClientProvider>
  );
};



// Hook pour utiliser le contexte Query
export const useQueryContext = () => {
  const context = useContext(QueryContext);
  if (context === undefined) {
    throw new Error('useQueryContext must be used within a QueryProvider');
  }
  return context;
};

// Export du client pour utilisation dans les hooks personnalisés
export { queryClient };
