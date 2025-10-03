// Composant pour les éléments de texte dans l'éditeur
// Architecture définie par Claude 4.5 Sonnet

import React, { useState, useRef, useEffect } from 'react';
import { EditorElement } from '../../types/editor.types';
import { useEmailEditorStore } from '../../hooks/useEmailEditor';

interface TextBlockProps {
  element: EditorElement;
}

export const TextBlock: React.FC<TextBlockProps> = ({ element }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [textContent, setTextContent] = useState(element.content);
  const { updateElement, selectedElement } = useEmailEditorStore();
  const textRef = useRef<HTMLDivElement>(null);
  const isSelected = selectedElement?.id === element.id;

  useEffect(() => {
    setTextContent(element.content);
  }, [element.content]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (textContent !== element.content) {
      updateElement(element.id, { content: textContent });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setTextContent(element.content);
      setIsEditing(false);
    }
  };

  const textStyle = {
    width: '100%',
    height: '100%',
    minHeight: '20px',
    outline: 'none',
    border: 'none',
    background: 'transparent',
    resize: 'none' as const,
    fontFamily: 'inherit',
    fontSize: element.styles.fontSize || '16px',
    fontWeight: element.styles.fontWeight || 'normal',
    color: element.styles.color || '#333333',
    textAlign: element.styles.textAlign || 'left',
    lineHeight: element.styles.lineHeight || '1.5',
    padding: element.styles.padding || '10px',
    margin: element.styles.margin || '0',
    cursor: isEditing ? 'text' : 'default',
  };

  const containerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '40px',
    position: 'relative' as const,
    backgroundColor: element.styles.backgroundColor || 'transparent',
    borderRadius: element.styles.borderRadius || '0',
    border: element.styles.border || 'none',
  };

  if (isEditing) {
    return (
      <div style={containerStyle}>
        <textarea
          ref={textRef as any}
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          style={{
            ...textStyle,
            resize: 'none',
          }}
          autoFocus
          placeholder="Saisissez votre texte..."
        />
      </div>
    );
  }

  return (
    <div style={containerStyle} onDoubleClick={handleDoubleClick}>
      <div
        style={textStyle}
        dangerouslySetInnerHTML={{ __html: textContent || 'Double-cliquez pour éditer' }}
      />
      
      {/* Indicateur d'édition */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: -20,
            right: 0,
            fontSize: '10px',
            color: '#007bff',
            backgroundColor: 'white',
            padding: '2px 6px',
            borderRadius: '2px',
            border: '1px solid #007bff',
            whiteSpace: 'nowrap',
          }}
        >
          Double-clic pour éditer
        </div>
      )}
    </div>
  );
};
