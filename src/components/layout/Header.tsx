import React, { memo, useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { useSidebar } from '../../store/useAppStore';
import { useKeyboardShortcuts, useFocusTrap } from '../../hooks';
import { Button, Avatar, Badge } from '../ui';
import { cn } from '../../lib/utils';

// Mapping des titres de pages
const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/campaigns': 'Campagnes',
  '/contacts': 'Contacts',
  '/templates': 'Templates',
  '/statistics': 'Statistiques',
  '/settings': 'Paramètres',
  '/demo': 'Démonstration UI'
};

// Notifications factices
const notifications = [
  {
    id: '1',
    title: 'Campagne terminée',
    message: 'Newsletter Janvier a été envoyée avec succès',
    time: '2 min',
    unread: true
  },
  {
    id: '2',
    title: 'Nouveau contact',
    message: '15 nouveaux contacts ajoutés',
    time: '1h',
    unread: true
  },
  {
    id: '3',
    title: 'Rapport disponible',
    message: 'Rapport mensuel prêt à télécharger',
    time: '3h',
    unread: false
  }
];

export const Header: React.FC = memo(() => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { setTheme, actualTheme } = useTheme();
  const { toggleSidebar } = useSidebar();
  
  // États des menus
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Refs pour la gestion du focus
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Focus trap pour les menus
  const userMenuFocusRef = useFocusTrap(showUserMenu);
  const notificationsFocusRef = useFocusTrap(showNotifications);

  // Raccourcis clavier
  useKeyboardShortcuts({
    'ctrl+k': () => searchInputRef.current?.focus(),
    'ctrl+shift+t': () => setTheme(actualTheme === 'dark' ? 'light' : 'dark'),
    'ctrl+shift+n': () => setShowNotifications(!showNotifications),
    'ctrl+shift+u': () => setShowUserMenu(!showUserMenu),
    'escape': () => {
      setShowUserMenu(false);
      setShowNotifications(false);
    }
  });

  // Fermer les menus en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentPageTitle = pageTitles[location.pathname] || 'EmailPro';
  const unreadNotifications = notifications.filter(n => n.unread).length;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleThemeToggle = () => {
    setTheme(actualTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header 
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
      role="banner"
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
            aria-label="Ouvrir le menu de navigation"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Page Title */}
          <div>
            <h1 
              className="text-xl font-semibold text-gray-900 dark:text-white"
              id="page-title"
            >
              {currentPageTitle}
            </h1>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
              aria-hidden="true"
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Rechercher... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600',
                'rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white',
                'placeholder-gray-500 dark:placeholder-gray-400',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              )}
              aria-label="Rechercher dans l'application"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            aria-label={`Passer au thème ${actualTheme === 'dark' ? 'clair' : 'sombre'} (Ctrl+Shift+T)`}
            title={`Thème ${actualTheme === 'dark' ? 'clair' : 'sombre'}`}
          >
            {actualTheme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label={`Notifications${unreadNotifications > 0 ? ` (${unreadNotifications} non lues)` : ''}`}
              aria-expanded={showNotifications}
              aria-haspopup="true"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 text-xs"
                  variant="destructive"
                  aria-label={`${unreadNotifications} notifications non lues`}
                >
                  {unreadNotifications}
                </Badge>
              )}
            </Button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div
                ref={notificationsFocusRef as React.RefObject<HTMLDivElement>}
                className={cn(
                  'absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800',
                  'border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50'
                )}
                role="menu"
                aria-labelledby="notifications-button"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Notifications
                  </h3>
                </div>
                
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0',
                        'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer',
                        notification.unread && 'bg-blue-50 dark:bg-blue-900/10'
                      )}
                      role="menuitem"
                      tabIndex={0}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {notification.title}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 ml-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {notification.time}
                          </span>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full" aria-label="Non lu" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="ghost" size="sm" className="w-full">
                    Voir toutes les notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <Button
              variant="ghost"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 px-3"
              aria-label="Menu utilisateur"
              aria-expanded={showUserMenu}
              aria-haspopup="true"
            >
              <Avatar size="sm" fallback={user?.name?.[0] || 'U'} />
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.name || 'Utilisateur'}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </Button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div
                ref={userMenuFocusRef as React.RefObject<HTMLDivElement>}
                className={cn(
                  'absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800',
                  'border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50'
                )}
                role="menu"
                aria-labelledby="user-menu-button"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user?.name || 'Utilisateur'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
                
                <div className="py-2">
                  <button
                    className={cn(
                      'flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300',
                      'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                    )}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profil
                  </button>
                  
                  <button
                    className={cn(
                      'flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300',
                      'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                    )}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Paramètres
                  </button>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                  <button
                    onClick={handleLogout}
                    className={cn(
                      'flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400',
                      'hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors'
                    )}
                    role="menuitem"
                    tabIndex={0}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';
