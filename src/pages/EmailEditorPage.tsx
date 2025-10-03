import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { 
  Type, 
  Heading, 
  Image, 
  MousePointer, 
  Minus, 
  Space, 
  Save, 
  Eye, 
  Smartphone, 
  Monitor,
  Plus,
  Trash2,
  Copy
} from 'lucide-react';

interface SimpleBlock {
  id: string;
  type: 'text' | 'heading' | 'image' | 'button' | 'divider' | 'spacer';
  content: any;
  styles: any;
}

interface SimpleTemplate {
  id: string;
  name: string;
  subject: string;
  blocks: SimpleBlock[];
}

export const EmailEditorPage: React.FC = () => {
  const [template, setTemplate] = useState<SimpleTemplate>({
    id: 'template-1',
    name: 'Nouveau Template',
    subject: 'Sujet de votre email',
    blocks: []
  });

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showPreview, setShowPreview] = useState(false);

  const blockTypes = [
    { type: 'text', icon: Type, label: 'Texte', description: 'Paragraphe de texte' },
    { type: 'heading', icon: Heading, label: 'Titre', description: 'Titre H1-H6' },
    { type: 'image', icon: Image, label: 'Image', description: 'Image avec lien' },
    { type: 'button', icon: MousePointer, label: 'Bouton', description: 'Bouton CTA' },
    { type: 'divider', icon: Minus, label: 'Séparateur', description: 'Ligne de séparation' },
    { type: 'spacer', icon: Space, label: 'Espacement', description: 'Espace vertical' },
  ];

  const createDefaultBlock = (type: string): SimpleBlock => {
    const baseBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: type as any,
      styles: {
        padding: '10px',
        margin: '5px 0',
        backgroundColor: 'transparent',
      }
    };

    switch (type) {
      case 'text':
        return {
          ...baseBlock,
          content: {
            text: 'Votre texte ici...',
            fontSize: '16px',
            color: '#333333',
            fontFamily: 'Arial, sans-serif'
          }
        };
      case 'heading':
        return {
          ...baseBlock,
          content: {
            text: 'Votre titre ici',
            level: 'h2',
            fontSize: '24px',
            color: '#333333',
            fontFamily: 'Arial, sans-serif'
          }
        };
      case 'image':
        return {
          ...baseBlock,
          content: {
            src: 'https://via.placeholder.com/600x300',
            alt: 'Image',
            width: '100%',
            link: ''
          }
        };
      case 'button':
        return {
          ...baseBlock,
          content: {
            text: 'Cliquez ici',
            link: '#',
            backgroundColor: '#007bff',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '4px'
          }
        };
      case 'divider':
        return {
          ...baseBlock,
          content: {
            height: '1px',
            color: '#cccccc',
            style: 'solid'
          }
        };
      case 'spacer':
        return {
          ...baseBlock,
          content: {
            height: '20px'
          }
        };
      default:
        return {
          ...baseBlock,
          content: {
            text: 'Bloc par défaut'
          }
        };
    }
  };

  const addBlock = (type: string) => {
    const newBlock = createDefaultBlock(type);
    setTemplate(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
  };

  const updateBlock = (blockId: string, updates: any) => {
    setTemplate(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === blockId 
          ? { ...block, ...updates }
          : block
      )
    }));
  };

  const deleteBlock = (blockId: string) => {
    setTemplate(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId)
    }));
    setSelectedBlockId(null);
  };

  const duplicateBlock = (blockId: string) => {
    const blockToDuplicate = template.blocks.find(b => b.id === blockId);
    if (blockToDuplicate) {
      const duplicatedBlock = {
        ...blockToDuplicate,
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      setTemplate(prev => ({
        ...prev,
        blocks: [...prev.blocks, duplicatedBlock]
      }));
    }
  };

  const renderBlock = (block: SimpleBlock) => {
    const isSelected = selectedBlockId === block.id;
    
    const blockStyle = {
      ...block.styles,
      border: isSelected ? '2px solid #007bff' : '1px solid transparent',
      cursor: 'pointer',
      position: 'relative' as const
    };

    const handleBlockClick = () => {
      setSelectedBlockId(block.id);
    };

    let content;
    switch (block.type) {
      case 'text':
        content = (
          <div style={{ 
            fontSize: block.content.fontSize,
            color: block.content.color,
            fontFamily: block.content.fontFamily
          }}>
            {block.content.text}
          </div>
        );
        break;
      case 'heading':
        const headingLevel = `h${block.content.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        content = React.createElement(headingLevel, {
          style: {
            fontSize: block.content.fontSize,
            fontWeight: block.content.fontWeight,
            color: block.content.color,
            margin: 0
          }
        }, block.content.text);
        break;
      case 'image':
        content = (
          <img 
            src={block.content.src} 
            alt={block.content.alt}
            style={{ 
              width: block.content.width,
              maxWidth: '100%',
              height: 'auto'
            }}
          />
        );
        break;
      case 'button':
        content = (
          <div style={{ textAlign: 'center' }}>
            <a 
              href={block.content.link}
              style={{
                display: 'inline-block',
                backgroundColor: block.content.backgroundColor,
                color: block.content.color,
                padding: block.content.padding,
                borderRadius: block.content.borderRadius,
                textDecoration: 'none'
              }}
            >
              {block.content.text}
            </a>
          </div>
        );
        break;
      case 'divider':
        content = (
          <hr style={{
            height: block.content.height,
            backgroundColor: block.content.color,
            border: 'none',
            borderStyle: block.content.style
          }} />
        );
        break;
      case 'spacer':
        content = (
          <div style={{ height: block.content.height }} />
        );
        break;
      default:
        content = <div>Bloc non supporté</div>;
    }

    return (
      <div key={block.id} style={blockStyle} onClick={handleBlockClick}>
        {content}
        {isSelected && (
          <div className="absolute -top-8 left-0 flex space-x-1 bg-white border border-gray-200 rounded px-2 py-1 shadow-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                duplicateBlock(block.id);
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                deleteBlock(block.id);
              }}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  const selectedBlock = template.blocks.find(b => b.id === selectedBlockId);

  const generatePreviewHTML = () => {
    return `
      <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px;">
          <h1 style="margin: 0 0 20px 0; font-size: 24px;">${template.subject}</h1>
          ${template.blocks.map(block => {
            switch (block.type) {
              case 'text':
                return `<div style="margin: 10px 0; font-size: ${block.content.fontSize}; color: ${block.content.color};">${block.content.text}</div>`;
              case 'heading':
                return `<${block.content.level} style="margin: 15px 0; font-size: ${block.content.fontSize}; color: ${block.content.color};">${block.content.text}</${block.content.level}>`;
              case 'image':
                return `<div style="text-align: center; margin: 15px 0;"><img src="${block.content.src}" alt="${block.content.alt}" style="max-width: 100%; height: auto;"></div>`;
              case 'button':
                return `<div style="text-align: center; margin: 15px 0;"><a href="${block.content.link}" style="display: inline-block; background-color: ${block.content.backgroundColor}; color: ${block.content.color}; padding: ${block.content.padding}; border-radius: ${block.content.borderRadius}; text-decoration: none;">${block.content.text}</a></div>`;
              case 'divider':
                return `<hr style="margin: 15px 0; height: ${block.content.height}; background-color: ${block.content.color}; border: none;">`;
              case 'spacer':
                return `<div style="height: ${block.content.height};"></div>`;
              default:
                return '';
            }
          }).join('')}
        </div>
      </div>
    `;
  };

  return (
    <PageWrapper
      title="Éditeur d'Email"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Campagnes', href: '/campaigns' },
        { label: 'Éditeur d\'Email' }
      ]}
      actions={
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(previewMode === 'desktop' ? 'mobile' : 'desktop')}
          >
            {previewMode === 'desktop' ? <Smartphone className="h-4 w-4 mr-2" /> : <Monitor className="h-4 w-4 mr-2" />}
            {previewMode === 'desktop' ? 'Mobile' : 'Bureau'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Éditeur' : 'Aperçu'}
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      }
    >
      <div className="flex h-[calc(100vh-200px)]">
        {/* Sidebar - Blocs */}
        {!showPreview && (
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Blocs</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Cliquez pour ajouter des blocs à votre email
              </p>
              <div className="space-y-2">
                {blockTypes.map(({ type, icon: Icon, label, description }) => (
                  <button
                    key={type}
                    onClick={() => addBlock(type)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-primary-50 dark:hover:border-primary-600 dark:hover:bg-primary-900/20 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
                      <Icon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Zone principale */}
        <div className="flex-1 flex">
          {/* Canvas */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {showPreview ? (
              <div className={`mx-auto ${previewMode === 'mobile' ? 'max-w-sm' : 'max-w-4xl'}`}>
                <Card>
                  <CardHeader>
                    <CardTitle>Aperçu - {previewMode === 'desktop' ? 'Bureau' : 'Mobile'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <iframe
                      srcDoc={generatePreviewHTML()}
                      className="w-full h-96 border-0"
                      title="Aperçu de l'email"
                    />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <Input
                          value={template.name}
                          onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                          className="text-lg font-semibold border-none p-0 h-auto"
                          placeholder="Nom du template"
                        />
                        <Input
                          value={template.subject}
                          onChange={(e) => setTemplate(prev => ({ ...prev, subject: e.target.value }))}
                          className="text-sm text-gray-600 border-none p-0 h-auto mt-1"
                          placeholder="Sujet de l'email"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="min-h-96 bg-white p-6 rounded border-2 border-dashed border-gray-200">
                      {template.blocks.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="text-gray-400 mb-4">
                            <Plus className="h-12 w-12 mx-auto" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Votre email est vide
                          </h3>
                          <p className="text-gray-600">
                            Ajoutez des blocs depuis la sidebar pour commencer à créer votre email
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {template.blocks.map(renderBlock)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Panneau de propriétés */}
          {!showPreview && (
            <div className="w-80 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Propriétés</h3>
              
              {selectedBlock ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Bloc {selectedBlock.type}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedBlock.type === 'text' && (
                        <>
                          <div>
                            <label className="text-sm font-medium">Texte</label>
                            <Textarea
                              value={selectedBlock.content.text}
                              onChange={(e) => updateBlock(selectedBlock.id, {
                                content: { ...selectedBlock.content, text: e.target.value }
                              })}
                              rows={3}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Couleur</label>
                            <Input
                              type="color"
                              value={selectedBlock.content.color}
                              onChange={(e) => updateBlock(selectedBlock.id, {
                                content: { ...selectedBlock.content, color: e.target.value }
                              })}
                            />
                          </div>
                        </>
                      )}
                      
                      {selectedBlock.type === 'heading' && (
                        <>
                          <div>
                            <label className="text-sm font-medium">Titre</label>
                            <Input
                              value={selectedBlock.content.text}
                              onChange={(e) => updateBlock(selectedBlock.id, {
                                content: { ...selectedBlock.content, text: e.target.value }
                              })}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Niveau</label>
                            <select
                              value={selectedBlock.content.level}
                              onChange={(e) => updateBlock(selectedBlock.id, {
                                content: { ...selectedBlock.content, level: e.target.value }
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                              <option value="h1">H1</option>
                              <option value="h2">H2</option>
                              <option value="h3">H3</option>
                              <option value="h4">H4</option>
                              <option value="h5">H5</option>
                              <option value="h6">H6</option>
                            </select>
                          </div>
                        </>
                      )}
                      
                      {selectedBlock.type === 'button' && (
                        <>
                          <div>
                            <label className="text-sm font-medium">Texte du bouton</label>
                            <Input
                              value={selectedBlock.content.text}
                              onChange={(e) => updateBlock(selectedBlock.id, {
                                content: { ...selectedBlock.content, text: e.target.value }
                              })}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Lien</label>
                            <Input
                              value={selectedBlock.content.link}
                              onChange={(e) => updateBlock(selectedBlock.id, {
                                content: { ...selectedBlock.content, link: e.target.value }
                              })}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Couleur de fond</label>
                            <Input
                              type="color"
                              value={selectedBlock.content.backgroundColor}
                              onChange={(e) => updateBlock(selectedBlock.id, {
                                content: { ...selectedBlock.content, backgroundColor: e.target.value }
                              })}
                            />
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Sélectionnez un bloc pour voir ses propriétés
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};
