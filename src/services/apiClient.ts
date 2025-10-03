// Client API amélioré avec retry et timeout

export interface ApiRequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: any;
}

class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetries: number;
  private defaultRetryDelay: number;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    this.defaultTimeout = 10000; // 10 secondes
    this.defaultRetries = 3;
    this.defaultRetryDelay = 1000; // 1 seconde
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private createApiError(message: string, status?: number, details?: any): ApiError {
    const error = new Error(message) as ApiError;
    error.status = status;
    error.details = details;
    return error;
  }

  private async executeRequest<T>(
    url: string,
    options: RequestInit,
    config: ApiRequestConfig = {}
  ): Promise<T> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      retryDelay = this.defaultRetryDelay,
      signal
    } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Combiner les signaux d'abort
    const combinedSignal = signal ? this.combineAbortSignals([signal, controller.signal]) : controller.signal;

    const requestOptions: RequestInit = {
      ...options,
      signal: combinedSignal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    let lastError: ApiError;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${this.baseURL}${url}`, requestOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw this.createApiError(
            errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            errorData
          );
        }

        // Gérer les réponses vides (204 No Content)
        if (response.status === 204) {
          return undefined as T;
        }

        const data = await response.json();
        return data;

      } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error && error.name === 'AbortError') {
          throw this.createApiError('Requête annulée ou timeout', 408);
        }

        lastError = error as ApiError;

        // Ne pas retry sur certaines erreurs
        if (lastError.status && [400, 401, 403, 404, 422].includes(lastError.status)) {
          throw lastError;
        }

        // Retry seulement si ce n'est pas la dernière tentative
        if (attempt < retries) {
          await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
        }
      }
    }

    throw lastError!;
  }

  private combineAbortSignals(signals: AbortSignal[]): AbortSignal {
    const controller = new AbortController();

    for (const signal of signals) {
      if (signal.aborted) {
        controller.abort();
        break;
      }
      signal.addEventListener('abort', () => controller.abort());
    }

    return controller.signal;
  }

  async get<T>(url: string, config?: ApiRequestConfig): Promise<T> {
    return this.executeRequest<T>(url, { method: 'GET' }, config);
  }

  async post<T>(url: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    return this.executeRequest<T>(
      url,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    );
  }

  async put<T>(url: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    return this.executeRequest<T>(
      url,
      {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    );
  }

  async patch<T>(url: string, data?: any, config?: ApiRequestConfig): Promise<T> {
    return this.executeRequest<T>(
      url,
      {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    );
  }

  async delete<T>(url: string, config?: ApiRequestConfig): Promise<T> {
    return this.executeRequest<T>(url, { method: 'DELETE' }, config);
  }

  // Méthodes utilitaires
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }

  setDefaultTimeout(timeout: number): void {
    this.defaultTimeout = timeout;
  }

  setDefaultRetries(retries: number): void {
    this.defaultRetries = retries;
  }

  setDefaultRetryDelay(delay: number): void {
    this.defaultRetryDelay = delay;
  }
}

// Instance par défaut
export const apiClient = new ApiClient();

// Hook pour créer des requêtes avec abort controller
export const useApiRequest = () => {
  const abortController = new AbortController();

  const request = <T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any,
    config?: Omit<ApiRequestConfig, 'signal'>
  ): Promise<T> => {
    return apiClient[method]<T>(url, data, {
      ...config,
      signal: abortController.signal
    });
  };

  const abort = () => {
    abortController.abort();
  };

  return { request, abort };
};

// Types utilitaires
export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// Intercepteurs (pour l'authentification, logging, etc.)
export interface RequestInterceptor {
  (config: RequestInit): RequestInit | Promise<RequestInit>;
}

export interface ResponseInterceptor {
  (response: Response): Response | Promise<Response>;
}

export interface ErrorInterceptor {
  (error: ApiError): ApiError | Promise<ApiError>;
}

class InterceptorManager {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  async processRequest(config: RequestInit): Promise<RequestInit> {
    let processedConfig = config;
    for (const interceptor of this.requestInterceptors) {
      processedConfig = await interceptor(processedConfig);
    }
    return processedConfig;
  }

  async processResponse(response: Response): Promise<Response> {
    let processedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse);
    }
    return processedResponse;
  }

  async processError(error: ApiError): Promise<ApiError> {
    let processedError = error;
    for (const interceptor of this.errorInterceptors) {
      processedError = await interceptor(processedError);
    }
    return processedError;
  }
}

export const interceptors = new InterceptorManager();

// Exemple d'intercepteur pour l'authentification
export const authInterceptor: RequestInterceptor = (config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    };
  }
  return config;
};

// Exemple d'intercepteur pour le logging
export const loggingInterceptor: ResponseInterceptor = (response) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`API Response: ${response.status} ${response.url}`);
  }
  return response;
};
