import React, { useState, useRef, useEffect } from 'react';
import { EmailBlock, TextBlock as TextBlockType, BlockStyles } from '../../../../types/emailEditor';
import { useEmailEditorStore } from '../../../../contexts/EmailEditorContext';
import { useBlockStyles } from '../../../../hooks/useBlockStyles';

interface TextBlockProps {
  element: EmailBlock;
}

export const TextBlock: React.FC<TextBlockProps> = ({ element }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [textContent, setTextContent] = useState('');
  const { state, actions } = useEmailEditorStore();
  const textRef = useRef<HTMLDivElement>(null);

  // 1. TOUS les hooks sont déclarés inconditionnellement au début
  const baseBlockStyles = useBlockStyles(element.styles);

  useEffect(() => {
    if (element && element.type === 'text') {
      const textElement = element as TextBlockType;
      setTextContent(textElement.content?.text || '');
    }
  }, [element]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (element?.type === 'text') {
      const textElement = element as TextBlockType;
      if (textContent !== textElement.content?.text && actions?.updateBlock) {
        actions.updateBlock(element.id, {
          ...textElement,
          content: { ...textElement.content, text: textContent }
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      if (element?.type === 'text') {
        const textElement = element as TextBlockType;
        setTextContent(textElement.content?.text || '');
      }
      setIsEditing(false);
    }
  };

  // 4. Gestion des cas d'erreur dans le rendu plutôt qu'avec des returns précoces
  if (!element) {
    return <div className="text-block-error">Erreur: Élément non défini</div>;
  }

  if (element.type !== 'text') {
    return <div className="text-block-error">Erreur: Type d'élément incorrect</div>;
  }

  // 5. Type casting fait après la vérification de type
  const textElement = element as TextBlockType;
  const isSelected = state.selectedBlockId === element.id;

  const textStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    minHeight: '20px',
    outline: 'none',
    border: 'none',
    background: 'transparent',
    resize: 'none' as const,
    fontFamily: 'inherit',
    fontSize: textElement.styles?.fontSize || '16px',
    fontWeight: textElement.styles?.fontWeight || 'normal',
    color: textElement.styles?.color || '#333333',
    textAlign: (textElement.styles?.textAlign as any) || 'left',
    lineHeight: textElement.styles?.lineHeight || '1.5',
    padding: baseBlockStyles.padding,
    margin: baseBlockStyles.margin,
    cursor: isEditing ? 'text' : 'default',
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    minHeight: '40px',
    position: 'relative' as const,
    backgroundColor: baseBlockStyles.backgroundColor || 'transparent',
    borderRadius: baseBlockStyles.borderRadius || '0',
    border: baseBlockStyles.border || 'none',
  };

  // 7. Rendu conditionnel basé sur isEditing
  return (
    <div style={containerStyle} onDoubleClick={handleDoubleClick}>
      {isEditing ? (
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
      ) : (
        <>
          <div
            style={textStyle}
            dangerouslySetInnerHTML={{ __html: textContent || 'Double-cliquez pour éditer' }}
          />
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
        </>
      )}
    </div>
  );
};
