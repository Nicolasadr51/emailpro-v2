import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types pour l'état de l'application
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface UIState {
  sidebarCollapsed: boolean;
  notifications: Notification[];
  isLoading: boolean;
  loadingMessage?: string;
}

interface AppState extends UIState {
  // Actions pour l'UI
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Actions pour les notifications
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Actions pour le loading
  setLoading: (loading: boolean, message?: string) => void;
  
  // Actions pour réinitialiser l'état
  reset: () => void;
}

// État initial
const initialState: UIState = {
  sidebarCollapsed: false,
  notifications: [],
  isLoading: false,
  loadingMessage: undefined,
};

// Store principal de l'application
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        // Actions pour la sidebar
        toggleSidebar: () => {
          set((state) => ({
            sidebarCollapsed: !state.sidebarCollapsed
          }), false, 'toggleSidebar');
        },
        
        setSidebarCollapsed: (collapsed: boolean) => {
          set({ sidebarCollapsed: collapsed }, false, 'setSidebarCollapsed');
        },
        
        // Actions pour les notifications
        addNotification: (notification: Omit<Notification, 'id'>) => {
          const id = Math.random().toString(36).substr(2, 9);
          const newNotification: Notification = {
            id,
            duration: 5000, // 5 secondes par défaut
            ...notification,
          };
          
          set((state) => ({
            notifications: [...state.notifications, newNotification]
          }), false, 'addNotification');
          
          // Auto-suppression après la durée spécifiée
          if (newNotification.duration && newNotification.duration > 0) {
            setTimeout(() => {
              get().removeNotification(id);
            }, newNotification.duration);
          }
        },
        
        removeNotification: (id: string) => {
          set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
          }), false, 'removeNotification');
        },
        
        clearNotifications: () => {
          set({ notifications: [] }, false, 'clearNotifications');
        },
        
        // Actions pour le loading
        setLoading: (loading: boolean, message?: string) => {
          set({
            isLoading: loading,
            loadingMessage: loading ? message : undefined
          }, false, 'setLoading');
        },
        
        // Réinitialiser l'état
        reset: () => {
          set(initialState, false, 'reset');
        },
      }),
      {
        name: 'emailpro-app-store',
        // Ne persister que certaines parties de l'état
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
        }),
      }
    ),
    {
      name: 'EmailPro App Store',
    }
  )
);

// Hooks utilitaires pour des parties spécifiques du store
export const useSidebar = () => {
  const { sidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useAppStore();
  return { sidebarCollapsed, toggleSidebar, setSidebarCollapsed };
};

export const useNotifications = () => {
  const { notifications, addNotification, removeNotification, clearNotifications } = useAppStore();
  return { notifications, addNotification, removeNotification, clearNotifications };
};

export const useLoading = () => {
  const { isLoading, loadingMessage, setLoading } = useAppStore();
  return { isLoading, loadingMessage, setLoading };
};
