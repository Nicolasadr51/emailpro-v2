import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user';
  subscription: 'free' | 'pro' | 'enterprise';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler la vérification du token au démarrage
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Simuler un utilisateur connecté pour le développement
          const mockUser: User = {
            id: '1',
            email: 'demo@emailpro.com',
            name: 'Utilisateur Demo',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
            role: 'admin',
            subscription: 'pro'
          };
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simuler l'appel API de connexion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        name: 'Utilisateur Demo',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        role: 'admin',
        subscription: 'pro'
      };
      
      localStorage.setItem('auth_token', 'mock_token_123');
      setUser(mockUser);
    } catch (error) {
      throw new Error('Échec de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Simuler l'appel API d'inscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        email,
        name,
        role: 'user',
        subscription: 'free'
      };
      
      localStorage.setItem('auth_token', 'mock_token_123');
      setUser(mockUser);
    } catch (error) {
      throw new Error('Échec de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      // Simuler l'appel API de mise à jour
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser({ ...user, ...data });
    } catch (error) {
      throw new Error('Échec de la mise à jour du profil');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
