import React, { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

// Mapping automatique des routes vers les breadcrumbs
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [
    { label: 'Accueil', href: '/dashboard' }
  ],
  '/campaigns': [
    { label: 'Accueil', href: '/dashboard' },
    { label: 'Campagnes', href: '/campaigns' }
  ],
  '/campaigns/new': [
    { label: 'Accueil', href: '/dashboard' },
    { label: 'Campagnes', href: '/campaigns' },
    { label: 'Nouvelle campagne', current: true }
  ],
  '/contacts': [
    { label: 'Accueil', href: '/dashboard' },
    { label: 'Contacts', href: '/contacts' }
  ],
  '/templates': [
    { label: 'Accueil', href: '/dashboard' },
    { label: 'Templates', href: '/templates' }
  ],
  '/statistics': [
    { label: 'Accueil', href: '/dashboard' },
    { label: 'Statistiques', href: '/statistics' }
  ],
  '/settings': [
    { label: 'Accueil', href: '/dashboard' },
    { label: 'Paramètres', href: '/settings' }
  ],
  '/demo': [
    { label: 'Accueil', href: '/dashboard' },
    { label: 'Démonstration UI', href: '/demo' }
  ]
};

export const Breadcrumb: React.FC<BreadcrumbProps> = memo(({ 
  items, 
  className 
}) => {
  const location = useLocation();
  
  // Utiliser les items fournis ou générer automatiquement
  const breadcrumbItems = items || routeMapping[location.pathname] || [
    { label: 'Accueil', href: '/dashboard' }
  ];

  if (breadcrumbItems.length <= 1) {
    return null; // Ne pas afficher si un seul élément
  }

  return (
    <nav 
      className={cn('flex items-center space-x-1 text-sm', className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;
          const isCurrent = item.current || isLast;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
              )}
              
              {index === 0 && (
                <Home className="h-4 w-4 text-gray-400 mr-2" />
              )}
              
              {isCurrent ? (
                <span className="text-gray-900 dark:text-white font-medium">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href!}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';
