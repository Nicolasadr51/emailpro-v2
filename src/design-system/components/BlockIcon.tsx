import React from 'react';
import { LucideIcon } from 'lucide-react';
import { designTokens } from '../tokens';

interface BlockIconProps {
  icon: LucideIcon;
  color: keyof typeof designTokens.colors.blocks;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: { container: 32, icon: 16 },
  md: { container: 40, icon: 20 },
  lg: { container: 48, icon: 24 },
};

export const BlockIcon: React.FC<BlockIconProps> = ({ 
  icon: Icon, 
  color, 
  size = 'md' 
}) => {
  const { container, icon } = sizeMap[size];
  
  return (
    <div
      style={{
        width: container,
        height: container,
        borderRadius: designTokens.borderRadius.md,
        backgroundColor: `${designTokens.colors.blocks[color]}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon 
        size={icon} 
        color={designTokens.colors.blocks[color]}
        strokeWidth={2}
      />
    </div>
  );
};
