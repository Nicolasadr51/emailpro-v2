import React, { useMemo } from 'react';
import { LucideIcon } from 'lucide-react';
import { designTokens, px } from '../tokens';
import { BlockIconProps, Size } from '../types';

const SIZE_CONFIG: Record<Size, { container: number; icon: number }> = {
  sm: { container: 32, icon: 16 },
  md: { container: 40, icon: 20 },
  lg: { container: 48, icon: 24 },
};

export const BlockIcon = React.memo<BlockIconProps>(({ 
  icon: Icon, 
  color, 
  size = 'md',
  'aria-label': ariaLabel,
}) => {
  const { container, icon } = SIZE_CONFIG[size];
  const blockColor = designTokens.colors.blocks[color];
  
  const containerStyle = useMemo<React.CSSProperties>(() => ({
    width: px(container),
    height: px(container),
    borderRadius: px(designTokens.borderRadius.md),
    backgroundColor: `${blockColor}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }), [container, blockColor]);

  return (
    <div
      style={containerStyle}
      role="img"
      aria-label={ariaLabel || `${color} block icon`}
    >
      <Icon 
        size={icon} 
        color={blockColor}
        strokeWidth={2}
        aria-hidden="true"
      />
    </div>
  );
});

BlockIcon.displayName = 'BlockIcon';
