import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { Button, Input, Checkbox } from '../../components/ui';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
    } catch (error) {
      console.error('Erreur de connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Connexion
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Connectez-vous à votre compte EmailPro
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Adresse email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="votre@email.com"
          leftIcon={<Mail className="h-4 w-4" />}
          required
        />

        <div className="relative">
          <Input
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <Checkbox
            label="Se souvenir de moi"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          
          <Link
            to="/auth/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
          loadingText="Connexion..."
        >
          Se connecter
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Pas encore de compte ?{' '}
          <Link
            to="/auth/register"
            className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            Créer un compte
          </Link>
        </p>
      </div>

      {/* Connexion rapide pour la démo */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-3">
          Connexion rapide pour la démo
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEmail('admin@emailpro.com');
              setPassword('admin123');
            }}
          >
            Admin
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEmail('user@emailpro.com');
              setPassword('user123');
            }}
          >
            Utilisateur
          </Button>
        </div>
      </div>
    </div>
  );
};
