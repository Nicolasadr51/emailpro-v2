import React from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

export type ViewMode = 'desktop' | 'tablet' | 'mobile';

interface ViewModeToggleProps {
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  className?: string;
}

export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  currentMode,
  onModeChange,
  className = ''
}) => {
  const modes = [
    {
      id: 'desktop' as ViewMode,
      icon: Monitor,
      label: 'Vue bureau',
      width: '600px'
    },
    {
      id: 'tablet' as ViewMode,
      icon: Tablet,
      label: 'Vue tablette',
      width: '768px'
    },
    {
      id: 'mobile' as ViewMode,
      icon: Smartphone,
      label: 'Vue mobile',
      width: '375px'
    }
  ];

  return (
    <div className={`flex items-center bg-gray-100 rounded-lg p-1 ${className}`}>
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = currentMode === mode.id;
        
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
              transition-all duration-200 ease-in-out
              ${isActive 
                ? 'bg-white text-blue-600 shadow-sm border border-blue-200' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
            aria-label={mode.label}
            aria-pressed={isActive}
            title={`${mode.label} (${mode.width})`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{mode.id}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ViewModeToggle;
