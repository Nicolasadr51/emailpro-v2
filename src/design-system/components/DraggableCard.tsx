import React, { useState } from 'react';
import { designTokens } from '../tokens';

interface DraggableCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  preview?: React.ReactNode;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onClick?: () => void;
  className?: string;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({
  icon,
  title,
  description,
  preview,
  onDragStart,
  onDragEnd,
  onClick,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart?.();
    
    // Créer une image de drag personnalisée
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(5deg)';
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd?.();
  };

  const cardStyle: React.CSSProperties = {
    padding: designTokens.spacing.md,
    borderRadius: designTokens.borderRadius.lg,
    border: `1px solid ${isHovered ? designTokens.colors.semantic.borderHover : designTokens.colors.semantic.border}`,
    backgroundColor: isHovered ? designTokens.colors.states.hover : designTokens.colors.semantic.background,
    cursor: 'grab',
    opacity: isDragging ? 0.5 : 1,
    transition: designTokens.transitions.base,
    boxShadow: isDragging ? designTokens.shadows.drag : isHovered ? designTokens.shadows.md : designTokens.shadows.sm,
    userSelect: 'none',
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={cardStyle}
      className={className}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing.md }}>
        {icon}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: designTokens.typography.sizes.base,
              fontWeight: designTokens.typography.weights.medium,
              color: designTokens.colors.semantic.text.primary,
              marginBottom: description ? designTokens.spacing.xs : 0,
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                fontSize: designTokens.typography.sizes.xs,
                color: designTokens.colors.semantic.text.secondary,
                lineHeight: 1.4,
              }}
            >
              {description}
            </div>
          )}
        </div>
      </div>
      {preview && (
        <div style={{ marginTop: designTokens.spacing.md }}>
          {preview}
        </div>
      )}
    </div>
  );
};
