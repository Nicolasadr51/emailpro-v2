import React from 'react';
import { designTokens } from '../tokens';

interface LayoutPreviewProps {
  columns: 1 | 2 | 3;
  ratio?: '1:1' | '2:1' | '1:2' | '1:1:1';
  size?: 'sm' | 'md';
}

export const LayoutPreview: React.FC<LayoutPreviewProps> = ({ 
  columns, 
  ratio = '1:1',
  size = 'md'
}) => {
  const containerSize = size === 'sm' ? 32 : 40;
  const gap = size === 'sm' ? 2 : 3;
  
  const getColumnWidths = () => {
    if (columns === 1) return ['100%'];
    if (columns === 2) {
      switch (ratio) {
        case '2:1': return ['66%', '30%'];
        case '1:2': return ['30%', '66%'];
        default: return ['47%', '47%'];
      }
    }
    if (columns === 3) return ['30%', '30%', '30%'];
    return ['100%'];
  };

  const widths = getColumnWidths();

  return (
    <div
      style={{
        width: containerSize,
        height: containerSize,
        backgroundColor: `${designTokens.colors.blocks.text}15`,
        borderRadius: designTokens.borderRadius.sm,
        padding: size === 'sm' ? 4 : 6,
        display: 'flex',
        gap: gap,
        alignItems: 'stretch',
      }}
    >
      {widths.map((width, index) => (
        <div
          key={index}
          style={{
            width,
            backgroundColor: designTokens.colors.blocks.text,
            borderRadius: 2,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
};
