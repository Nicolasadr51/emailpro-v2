import React, { useEffect, memo } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useNotifications } from '../../store/useAppStore';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
};

const iconColorMap = {
  success: 'text-green-500 dark:text-green-400',
  error: 'text-red-500 dark:text-red-400',
  warning: 'text-yellow-500 dark:text-yellow-400',
  info: 'text-blue-500 dark:text-blue-400',
};

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: (id: string) => void;
}

export const Toast = memo<ToastProps>(({
  id,
  type,
  title,
  message,
  duration,
  action,
  onClose
}) => {
  const Icon = iconMap[type];

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const handleClose = () => onClose(id);
  const handleActionClick = () => action?.onClick();

  return (
    <div className={`
      max-w-sm w-full border rounded-lg shadow-lg p-4 mb-3
      transform transition-all duration-300 ease-in-out
      ${colorMap[type]}
    `}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconColorMap[type]}`} />
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">
            {title}
          </h3>
          {message && (
            <p className="mt-1 text-sm opacity-90">
              {message}
            </p>
          )}
          {action && (
            <div className="mt-2">
              <button
                onClick={handleActionClick}
                className="text-sm font-medium underline hover:no-underline"
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
        
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={handleClose}
            className="inline-flex rounded-md p-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

Toast.displayName = 'Toast';

// Container pour afficher tous les toasts
export const ToastContainer: React.FC = memo(() => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          {...notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  );
});

ToastContainer.displayName = 'ToastContainer';
