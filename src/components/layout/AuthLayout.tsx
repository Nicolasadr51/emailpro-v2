import React, { memo } from 'react';
import { Mail } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = memo(({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            EmailPro
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Plateforme d'email marketing professionnelle
          </p>
        </div>

        {/* Contenu de la page d'auth */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          © 2024 EmailPro v2. Tous droits réservés.
          <br />
          Powered by Manus AI
        </div>
      </div>
    </div>
  );
});

AuthLayout.displayName = 'AuthLayout';
