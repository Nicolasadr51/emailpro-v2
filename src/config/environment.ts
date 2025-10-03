/**
 * Configuration d'environnement pour EmailPro V2
 * Centralise toutes les variables d'environnement
 */

export const environment = {
  // Mode de développement
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    timeout: 10000,
    retryAttempts: 3,
  },
  
  // Application Configuration
  app: {
    name: 'EmailPro V2',
    version: process.env.REACT_APP_VERSION || '2.0.0',
    description: 'Plateforme de marketing par email moderne et intuitive',
  },
  
  // Features Flags
  features: {
    enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
    enableDebugMode: process.env.REACT_APP_DEBUG_MODE === 'true',
    enableBetaFeatures: process.env.REACT_APP_BETA_FEATURES === 'true',
  },
  
  // Storage Configuration
  storage: {
    prefix: 'emailpro_v2_',
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 heures
  },
  
  // UI Configuration
  ui: {
    defaultPageSize: 10,
    maxPageSize: 100,
    debounceDelay: 300,
    animationDuration: 200,
  },
} as const;

export type Environment = typeof environment;
