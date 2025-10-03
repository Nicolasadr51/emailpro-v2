import React, { memo, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Mail, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Palette
} from 'lucide-react';
import { useSidebar } from '../../store/useAppStore';
import { useKeyboardShortcuts } from '../../hooks';
import { cn } from '../../lib/utils';

interface NavigationItem {
  path: string;
  title: string;
  icon: React.ReactNode;
  badge?: string | number;
  shortcut?: string;
  ariaLabel?: string;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    shortcut: 'ctrl+d',
    ariaLabel: 'Aller au tableau de bord',
    description: 'Vue d\'ensemble des campagnes'
  },
  {
    path: '/campaigns',
    title: 'Campagnes',
    icon: <Mail className="h-5 w-5" />,
    badge: '3',
    shortcut: 'ctrl+c',
    ariaLabel: 'Gérer les campagnes email',
    description: 'Créer et gérer vos campagnes'
  },
  {
    path: '/contacts',
    title: 'Contacts',
    icon: <Users className="h-5 w-5" />,
    shortcut: 'ctrl+u',
    ariaLabel: 'Gérer les contacts',
    description: 'Base de données des contacts'
  },
  {
    path: '/templates',
    title: 'Templates',
    icon: <FileText className="h-5 w-5" />,
    shortcut: 'ctrl+t',
    ariaLabel: 'Gérer les modèles d\'email',
    description: 'Modèles d\'emails réutilisables'
  },
  {
    path: '/statistics',
    title: 'Statistiques',
    icon: <BarChart3 className="h-5 w-5" />,
    shortcut: 'ctrl+s',
    ariaLabel: 'Voir les statistiques',
    description: 'Analyses et rapports'
  },
  {
    path: '/demo',
    title: 'Démo UI',
    icon: <Palette className="h-5 w-5" />,
    ariaLabel: 'Démonstration des composants UI',
    description: 'Composants de l\'interface'
  },
  {
    path: '/settings',
    title: 'Paramètres',
    icon: <Settings className="h-5 w-5" />,
    shortcut: 'ctrl+,',
    ariaLabel: 'Accéder aux paramètres',
    description: 'Configuration du compte'
  }
];

export const Sidebar: React.FC = memo(() => {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useSidebar();
  const sidebarRef = useRef<HTMLElement>(null);
  const skipLinkRef = useRef<HTMLAnchorElement>(null);

  // Raccourcis clavier pour la navigation
  const shortcuts = navigationItems.reduce((acc, item) => {
    if (item.shortcut) {
      acc[item.shortcut] = () => {
        window.location.href = item.path;
      };
    }
    return acc;
  }, {
    'ctrl+[': toggleSidebar, // Toggle sidebar
    'alt+s': () => sidebarRef.current?.focus() // Focus sidebar
  } as Record<string, () => void>);

  useKeyboardShortcuts(shortcuts);

  // Focus management pour l'accessibilité
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Échapper pour fermer la sidebar sur mobile
      if (e.key === 'Escape' && !sidebarCollapsed && window.innerWidth < 768) {
        toggleSidebar();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarCollapsed, toggleSidebar]);

  return (
    <>
      {/* Skip Navigation Link */}
      <a
        ref={skipLinkRef}
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50"
      >
        Aller au contenu principal
      </a>

      {/* Overlay pour mobile */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          'fixed left-0 top-0 z-50 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out',
          'md:relative md:z-auto',
          sidebarCollapsed ? 'w-16 md:w-16' : 'w-64 md:w-64',
          // Mobile: slide in/out
          sidebarCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
        )}
        aria-label="Navigation principale"
        role="navigation"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">
                EmailPro
              </span>
            </div>
          )}
          
          <button
            onClick={toggleSidebar}
            className={cn(
              'p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
              sidebarCollapsed && 'mx-auto'
            )}
            aria-label={sidebarCollapsed ? 'Développer la sidebar' : 'Réduire la sidebar'}
            title={sidebarCollapsed ? 'Développer la sidebar (Ctrl+[)' : 'Réduire la sidebar (Ctrl+[)'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4" role="menubar">
          <ul className="space-y-2" role="none">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path} role="none">
                  <Link
                    to={item.path}
                    className={cn(
                      'relative flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                      'hover:bg-gray-100 dark:hover:bg-gray-700',
                      isActive && 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300',
                      !isActive && 'text-gray-700 dark:text-gray-300'
                    )}
                    aria-label={item.ariaLabel || item.title}
                    aria-current={isActive ? 'page' : undefined}
                    title={sidebarCollapsed ? `${item.title}${item.shortcut ? ` (${item.shortcut})` : ''}` : item.description}
                    role="menuitem"
                  >
                    <span className="flex-shrink-0" aria-hidden="true">
                      {item.icon}
                    </span>
                    
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 font-medium">
                          {item.title}
                        </span>
                        
                        {item.badge && (
                          <span 
                            className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full"
                            aria-label={`${item.badge} éléments`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    
                    {/* Badge en mode collapsed */}
                    {sidebarCollapsed && item.badge && (
                      <span 
                        className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                        aria-label={`${item.badge} éléments`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer avec raccourcis clavier */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p className="mb-1 font-medium">Raccourcis clavier :</p>
              <div className="space-y-1">
                <p>Ctrl+[ : Toggle sidebar</p>
                <p>Alt+S : Focus sidebar</p>
                <p>Échap : Fermer (mobile)</p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';
