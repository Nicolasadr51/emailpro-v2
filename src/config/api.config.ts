/**
 * Configuration API pour EmailPro V2
 * Définit les endpoints et paramètres API
 */

import { environment } from './environment';

export const apiConfig = {
  baseUrl: environment.api.baseUrl,
  timeout: environment.api.timeout,
  
  // Endpoints principaux
  endpoints: {
    // Authentication
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      profile: '/auth/profile',
    },
    
    // Campaigns
    campaigns: {
      list: '/campaigns',
      create: '/campaigns',
      get: (id: string) => `/campaigns/${id}`,
      update: (id: string) => `/campaigns/${id}`,
      delete: (id: string) => `/campaigns/${id}`,
      duplicate: (id: string) => `/campaigns/${id}/duplicate`,
      send: (id: string) => `/campaigns/${id}/send`,
      stats: (id: string) => `/campaigns/${id}/stats`,
    },
    
    // Contacts
    contacts: {
      list: '/contacts',
      create: '/contacts',
      get: (id: string) => `/contacts/${id}`,
      update: (id: string) => `/contacts/${id}`,
      delete: (id: string) => `/contacts/${id}`,
      import: '/contacts/import',
      export: '/contacts/export',
      bulk: '/contacts/bulk',
    },
    
    // Templates
    templates: {
      list: '/templates',
      create: '/templates',
      get: (id: string) => `/templates/${id}`,
      update: (id: string) => `/templates/${id}`,
      delete: (id: string) => `/templates/${id}`,
      duplicate: (id: string) => `/templates/${id}/duplicate`,
    },
    
    // Statistics
    stats: {
      dashboard: '/stats/dashboard',
      campaigns: '/stats/campaigns',
      contacts: '/stats/contacts',
      performance: '/stats/performance',
    },
    
    // Editor
    editor: {
      save: '/editor/save',
      export: '/editor/export',
      preview: '/editor/preview',
    },
  },
  
  // Headers par défaut
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Configuration des retry
  retry: {
    attempts: environment.api.retryAttempts,
    delay: 1000,
    backoff: 2,
  },
} as const;

export type ApiConfig = typeof apiConfig;
