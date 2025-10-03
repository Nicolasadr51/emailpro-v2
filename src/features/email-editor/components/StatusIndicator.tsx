import React from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export type SaveStatus = 'saved' | 'saving' | 'error' | 'unsaved';

interface StatusIndicatorProps {
  status: SaveStatus;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'saved':
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-500" />,
          text: 'Modifications enregistrées',
          className: 'text-green-700 bg-green-50 border-green-200'
        };
      case 'saving':
        return {
          icon: <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />,
          text: 'Enregistrement en cours...',
          className: 'text-blue-700 bg-blue-50 border-blue-200'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4 text-red-500" />,
          text: 'Erreur d\'enregistrement',
          className: 'text-red-700 bg-red-50 border-red-200'
        };
      case 'unsaved':
        return {
          icon: <AlertCircle className="w-4 h-4 text-orange-500" />,
          text: 'Modifications non enregistrées',
          className: 'text-orange-700 bg-orange-50 border-orange-200'
        };
      default:
        return {
          icon: null,
          text: '',
          className: ''
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`
      flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium
      transition-all duration-200 ease-in-out
      ${config.className}
      ${className}
    `}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
};

export default StatusIndicator;
