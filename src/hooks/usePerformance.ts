import { useCallback, useRef, useEffect } from 'react';

/**
 * Hook pour debouncer une fonction
 */
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const debouncedCallback = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

/**
 * Hook pour throttler une fonction
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef<number>(Date.now());

  const throttledCallback = useCallback((...args: Parameters<T>) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]) as T;

  return throttledCallback;
};

/**
 * Hook pour memoizer des calculs coûteux avec dépendances personnalisées
 */
export const useDeepMemo = <T>(
  factory: () => T,
  deps: any[]
): T => {
  const ref = useRef<{ deps: any[]; value: T } | undefined>(undefined);

  const depsChanged = !ref.current || 
    deps.length !== ref.current.deps.length ||
    deps.some((dep, index) => !Object.is(dep, ref.current!.deps[index]));

  if (depsChanged) {
    ref.current = {
      deps: [...deps],
      value: factory()
    };
  }

  return ref.current!.value;
};

/**
 * Hook pour lazy loading des composants
 */
export const useLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => {
  const ComponentRef = useRef<T | null>(null);
  const loadingRef = useRef<boolean>(false);
  const errorRef = useRef<Error | null>(null);

  const loadComponent = useCallback(async () => {
    if (ComponentRef.current || loadingRef.current) return;

    try {
      loadingRef.current = true;
      const module = await importFunc();
      ComponentRef.current = module.default;
    } catch (error) {
      errorRef.current = error as Error;
    } finally {
      loadingRef.current = false;
    }
  }, [importFunc]);

  return {
    Component: ComponentRef.current,
    loading: loadingRef.current,
    error: errorRef.current,
    load: loadComponent
  };
};

/**
 * Hook pour optimiser les re-renders avec des callbacks stables
 */
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  const callbackRef = useRef<T>(callback);
  
  // Mettre à jour la référence sans déclencher de re-render
  useEffect(() => {
    callbackRef.current = callback;
  });

  // Retourner une fonction stable qui appelle toujours la dernière version
  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []) as T;
};

/**
 * Hook pour mesurer les performances de rendu
 */
export const useRenderPerformance = (componentName: string) => {
  const renderCount = useRef<number>(0);
  const startTime = useRef<number>(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
    }

    startTime.current = performance.now();
  });

  return {
    renderCount: renderCount.current,
    logPerformance: (operation: string, time: number) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} ${operation}: ${time.toFixed(2)}ms`);
      }
    }
  };
};

/**
 * Hook pour intersection observer (lazy loading d'images, etc.)
 */
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const elementRef = useRef<HTMLElement>(null);
  const isIntersecting = useRef<boolean>(false);
  const callbackRef = useRef<((isIntersecting: boolean) => void) | undefined>(undefined);

  const setCallback = useCallback((callback: (isIntersecting: boolean) => void) => {
    callbackRef.current = callback;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting.current = entry.isIntersecting;
      callbackRef.current?.(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return {
    ref: elementRef,
    isIntersecting: isIntersecting.current,
    setCallback
  };
};
