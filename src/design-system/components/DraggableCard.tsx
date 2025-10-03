import React, { useState, useCallback, useMemo, useRef } from 'react';
import { designTokens, getSpacing, getTransition, px } from '../tokens';
import { DraggableCardProps, DragData } from '../types';

const DRAG_MIME_TYPE = 'application/x-email-block';

export const DraggableCard = React.memo<DraggableCardProps>(({
  icon,
  title,
  description,
  preview,
  blockData,
  onDragStart,
  onDragEnd,
  onClick,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    
    const dragData: DragData = {
      blockType: blockData.type,
      blockData,
    };
    
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData(DRAG_MIME_TYPE, JSON.stringify(dragData));
    
    // Image de drag personnalisée
    if (cardRef.current) {
      const dragImage = cardRef.current.cloneNode(true) as HTMLElement;
      dragImage.style.position = 'absolute';
      dragImage.style.top = '-9999px';
      dragImage.style.transform = 'rotate(3deg)';
      dragImage.style.opacity = '0.9';
      dragImage.style.pointerEvents = 'none';
      document.body.appendChild(dragImage);
      
      e.dataTransfer.setDragImage(dragImage, 20, 20);
      
      requestAnimationFrame(() => {
        document.body.removeChild(dragImage);
      });
    }
    
    onDragStart?.(dragData);
  }, [blockData, onDragStart]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    onDragEnd?.();
  }, [onDragEnd]);

  const handleClick = useCallback(() => {
    onClick?.(blockData);
  }, [onClick, blockData]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const cardStyle = useMemo<React.CSSProperties>(() => ({
    padding: getSpacing('md'),
    borderRadius: px(designTokens.borderRadius.lg),
    border: `1px solid ${
      isFocused 
        ? designTokens.colors.states.focus
        : isHovered 
          ? designTokens.colors.semantic.borderHover 
          : designTokens.colors.semantic.border
    }`,
    backgroundColor: isHovered 
      ? designTokens.colors.states.hover 
      : designTokens.colors.semantic.background,
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0.5 : 1,
    transition: getTransition('all'),
    boxShadow: isDragging 
      ? designTokens.shadows.drag 
      : isHovered 
        ? designTokens.shadows.md 
        : designTokens.shadows.sm,
    userSelect: 'none',
    outline: isFocused ? `2px solid ${designTokens.colors.states.focus}` : 'none',
    outlineOffset: '2px',
  }), [isHovered, isDragging, isFocused]);

  const contentStyle = useMemo<React.CSSProperties>(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: getSpacing('md'),
  }), []);

  const titleStyle = useMemo<React.CSSProperties>(() => ({
    fontSize: px(designTokens.typography.sizes.base),
    fontWeight: designTokens.typography.weights.medium,
    color: designTokens.colors.semantic.text.primary,
    marginBottom: description ? getSpacing('xs') : 0,
    lineHeight: designTokens.typography.lineHeights.tight,
  }), [description]);

  const descriptionStyle = useMemo<React.CSSProperties>(() => ({
    fontSize: px(designTokens.typography.sizes.xs),
    color: designTokens.colors.semantic.text.secondary,
    lineHeight: designTokens.typography.lineHeights.normal,
  }), []);

  return (
    <div
      ref={cardRef}
      draggable
      role="button"
      tabIndex={0}
      aria-label={`Drag or click to add ${title}`}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={cardStyle}
      className={className}
    >
      <div style={contentStyle}>
        {icon}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={titleStyle}>
            {title}
          </div>
          {description && (
            <div style={descriptionStyle}>
              {description}
            </div>
          )}
        </div>
      </div>
      {preview && (
        <div style={{ marginTop: getSpacing('md') }}>
          {preview}
        </div>
      )}
    </div>
  );
});

DraggableCard.displayName = 'DraggableCard';

export { DRAG_MIME_TYPE };
