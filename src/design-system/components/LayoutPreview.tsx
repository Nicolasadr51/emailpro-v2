import React, { useMemo } from 'react';
import { designTokens, px } from '../tokens';
import { LayoutPreviewProps, ColumnRatio } from '../types';

const SIZE_CONFIG = {
  sm: { container: 32, gap: 2, padding: 4 },
  md: { container: 40, gap: 3, padding: 6 },
  lg: { container: 48, gap: 4, padding: 8 },
};

const getColumnWidths = (
  columns: 1 | 2 | 3, 
  ratio: ColumnRatio = '1:1'
): string[] => {
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

export const LayoutPreview = React.memo<LayoutPreviewProps>(({ 
  columns, 
  ratio = '1:1',
  size = 'md'
}) => {
  const { container, gap, padding } = SIZE_CONFIG[size];
  const widths = useMemo(() => getColumnWidths(columns, ratio), [columns, ratio]);

  const containerStyle = useMemo<React.CSSProperties>(() => ({
    width: px(container),
    height: px(container),
    backgroundColor: `${designTokens.colors.blocks.text}15`,
    borderRadius: px(designTokens.borderRadius.sm),
    padding: px(padding),
    display: 'flex',
    gap: px(gap),
    alignItems: 'stretch',
  }), [container, gap, padding]);

  const columnStyle = useMemo<React.CSSProperties>(() => ({
    backgroundColor: designTokens.colors.blocks.text,
    borderRadius: px(2),
    opacity: 0.7,
  }), []);

  return (
    <div 
      style={containerStyle}
      role="img"
      aria-label={`Layout with ${columns} column${columns > 1 ? 's' : ''}`}
    >
      {widths.map((width, index) => (
        <div
          key={index}
          style={{ ...columnStyle, width }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
});

LayoutPreview.displayName = 'LayoutPreview';
