import React, { memo } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useSidebar } from '../../store/useAppStore';
import { cn } from '../../lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = memo(({ children }) => {
  const { sidebarCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className={cn(
        'flex-1 flex flex-col transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      )}>
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
});

AppLayout.displayName = 'AppLayout';
