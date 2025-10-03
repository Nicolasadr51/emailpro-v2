import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

export const createWrapper = () => {
  const queryClient = createTestQueryClient();
  
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export function renderWithClient(hook: () => any) {
  const queryClient = createTestQueryClient();
  return {
    ...renderHook(hook, {
      wrapper: ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    }),
    queryClient,
  };
}

export const waitForMutation = async (result: any) => {
  const { waitFor } = await import('@testing-library/react');
  await waitFor(
    () => {
      if (result.current.isError) throw result.current.error;
      expect(result.current.isSuccess).toBe(true);
    },
    { timeout: 3000 }
  );
};
