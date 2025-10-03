/**
 * Constantes de routes pour EmailPro V2
 * Centralise toutes les routes de l'application
 */

export const ROUTES = {
  // Routes publiques
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Routes protégées - Dashboard
  DASHBOARD: '/dashboard',
  
  // Routes protégées - Campaigns
  CAMPAIGNS: '/campaigns',
  CAMPAIGNS_CREATE: '/campaigns/create',
  CAMPAIGNS_EDIT: (id: string) => `/campaigns/${id}/edit`,
  CAMPAIGNS_VIEW: (id: string) => `/campaigns/${id}`,
  CAMPAIGNS_DUPLICATE: (id: string) => `/campaigns/${id}/duplicate`,
  CAMPAIGNS_STATS: (id: string) => `/campaigns/${id}/stats`,
  
  // Routes protégées - Contacts
  CONTACTS: '/contacts',
  CONTACTS_CREATE: '/contacts/create',
  CONTACTS_EDIT: (id: string) => `/contacts/${id}/edit`,
  CONTACTS_VIEW: (id: string) => `/contacts/${id}`,
  CONTACTS_IMPORT: '/contacts/import',
  CONTACTS_EXPORT: '/contacts/export',
  
  // Routes protégées - Templates
  TEMPLATES: '/templates',
  TEMPLATES_CREATE: '/templates/create',
  TEMPLATES_EDIT: (id: string) => `/templates/${id}/edit`,
  TEMPLATES_VIEW: (id: string) => `/templates/${id}`,
  TEMPLATES_DUPLICATE: (id: string) => `/templates/${id}/duplicate`,
  
  // Routes protégées - Editor
  EDITOR: '/editor',
  EDITOR_NEW: '/editor/new',
  EDITOR_TEMPLATE: (id: string) => `/editor/template/${id}`,
  EDITOR_CAMPAIGN: (id: string) => `/editor/campaign/${id}`,
  
  // Routes protégées - Statistics
  STATISTICS: '/statistics',
  STATISTICS_CAMPAIGNS: '/statistics/campaigns',
  STATISTICS_CONTACTS: '/statistics/contacts',
  STATISTICS_PERFORMANCE: '/statistics/performance',
  
  // Routes protégées - Settings
  SETTINGS: '/settings',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_ACCOUNT: '/settings/account',
  SETTINGS_INTEGRATIONS: '/settings/integrations',
  
  // Routes d'erreur
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
  SERVER_ERROR: '/500',
} as const;

// Types pour la validation des routes
export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];

// Utilitaires pour les routes
export const routeUtils = {
  /**
   * Vérifie si une route est publique
   */
  isPublicRoute: (path: string): boolean => {
    const publicRoutes = [
      ROUTES.HOME,
      ROUTES.LOGIN,
      ROUTES.REGISTER,
      ROUTES.FORGOT_PASSWORD,
    ];
    return publicRoutes.includes(path as any);
  },
  
  /**
   * Vérifie si une route nécessite une authentification
   */
  isProtectedRoute: (path: string): boolean => {
    return !routeUtils.isPublicRoute(path) && path !== ROUTES.NOT_FOUND;
  },
  
  /**
   * Génère une URL avec des paramètres
   */
  buildUrl: (route: string, params?: Record<string, string>): string => {
    let url = route;
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url = url.replace(`:${key}`, value);
      });
    }
    return url;
  },
};
