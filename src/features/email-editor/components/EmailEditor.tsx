// Composant principal de l'éditeur d'emails
// Architecture définie par Claude 4.5 Sonnet

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmailEditor } from '../hooks/useEmailEditor';
import { EditorCanvas } from './EditorCanvas';
import { ElementsPanel } from './ElementsPanel';
import { PropertiesPanel } from './PropertiesPanel';
import { EditorToolbar } from './EditorToolbar';
import { TemplatesList } from './TemplatesList';
import { emailEditorService } from '../services/emailEditorService';
import { EmailTemplate } from '../types/editor.types';
import { PageWrapper } from '../../../components/layout/PageWrapper';
import { Button } from '../../../components/ui/Button';
import { SaveIcon, EyeIcon, ArrowLeftIcon, SettingsIcon } from 'lucide-react';

interface EmailEditorProps {
  className?: string;
}

export const EmailEditor: React.FC<EmailEditorProps> = ({ className = '' }) => {
  const { templateId } = useParams<{ templateId?: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showTemplates, setShowTemplates] = useState(!templateId);
  const [showProperties, setShowProperties] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const {
    template,
    elements,
    selectedElement,
    setTemplate,
    undo,
    redo,
    zoom,
    setZoom,
    history,
    historyIndex,
  } = useEmailEditor();

  // Chargement du template
  useEffect(() => {
    if (templateId && templateId !== 'new') {
      loadTemplate(templateId);
    } else if (templateId === 'new') {
      createNewTemplate();
    }
  }, [templateId]);

  const loadTemplate = async (id: string) => {
    setIsLoading(true);
    try {
      const loadedTemplate = await emailEditorService.getTemplate(id);
      setTemplate(loadedTemplate);
      setShowTemplates(false);
    } catch (error) {
      console.error('Erreur lors du chargement du template:', error);
      // Créer un nouveau template en cas d'erreur
      createNewTemplate();
    } finally {
      setIsLoading(false);
    }
  };

  const createNewTemplate = () => {
    const newTemplate: EmailTemplate = {
      id: `template_${Date.now()}`,
      name: 'Nouveau template',
      description: '',
      elements: [],
      layout: {
        width: 600,
        height: 800,
        backgroundColor: '#ffffff',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isPublic: false,
    };
    setTemplate(newTemplate);
    setShowTemplates(false);
  };

  const handleSave = async () => {
    if (!template) return;

    setIsSaving(true);
    try {
      if (template.id.startsWith('template_')) {
        // Nouveau template
        const savedTemplate = await emailEditorService.saveTemplate({
          name: template.name,
          description: template.description,
          elements: elements,
          layout: template.layout,
          isPublic: template.isPublic,
        });
        setTemplate(savedTemplate);
        navigate(`/email-editor/${savedTemplate.id}`, { replace: true });
      } else {
        // Template existant
        await emailEditorService.updateTemplate(template.id, {
          elements: elements,
          layout: template.layout,
        });
      }
      setLastSaved(new Date());
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = async () => {
    if (!template) return;

    try {
      const previewUrl = await emailEditorService.generatePreview(template.id);
      window.open(previewUrl, '_blank');
    } catch (error) {
      console.error('Erreur lors de la génération de la prévisualisation:', error);
    }
  };

  const handleTemplateSelect = (selectedTemplate: EmailTemplate) => {
    setTemplate(selectedTemplate);
    setShowTemplates(false);
    navigate(`/email-editor/${selectedTemplate.id}`);
  };

  const handleBack = () => {
    navigate('/campaigns');
  };

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case '=':
          case '+':
            e.preventDefault();
            setZoom(Math.min(2, zoom + 0.1));
            break;
          case '-':
            e.preventDefault();
            setZoom(Math.max(0.25, zoom - 0.1));
            break;
          case '0':
            e.preventDefault();
            setZoom(1);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoom, undo, redo, handleSave]);

  if (isLoading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du template...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (showTemplates) {
    return (
      <PageWrapper>
        <TemplatesList
          onTemplateSelect={handleTemplateSelect}
          onCreateNew={createNewTemplate}
          onBack={handleBack}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className={`email-editor ${className}`}>
      {/* Barre d'outils principale */}
      <div className="editor-header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon size={16} />
            Retour
          </Button>
          
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
              {template?.name || 'Éditeur d\'emails'}
            </h1>
            {lastSaved && (
              <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                Dernière sauvegarde: {lastSaved.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowProperties(!showProperties)}
            className="flex items-center gap-2"
          >
            <SettingsIcon size={16} />
            Propriétés
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="flex items-center gap-2"
          >
            <EyeIcon size={16} />
            Aperçu
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <SaveIcon size={16} />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>

      {/* Barre d'outils de l'éditeur */}
      <EditorToolbar
        onUndo={undo}
        onRedo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        zoom={zoom}
        onZoomChange={setZoom}
        selectedElement={selectedElement}
      />

      {/* Interface principale */}
      <div className="editor-main" style={{
        display: 'flex',
        height: 'calc(100vh - 140px)',
        overflow: 'hidden',
      }}>
        {/* Panneau des éléments */}
        <ElementsPanel />

        {/* Canvas principal */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <EditorCanvas />
        </div>

        {/* Panneau des propriétés */}
        {showProperties && (
          <PropertiesPanel
            selectedElement={selectedElement}
            template={template}
          />
        )}
      </div>

      {/* Indicateurs de statut */}
      <div className="editor-status" style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        gap: '8px',
        zIndex: 1000,
      }}>
        {elements.length > 0 && (
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '500',
          }}>
            {elements.length} élément{elements.length > 1 ? 's' : ''}
          </div>
        )}
        
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '500',
        }}>
          {Math.round(zoom * 100)}%
        </div>
      </div>
    </PageWrapper>
  );
};

// Styles CSS pour l'éditeur
export const emailEditorStyles = `
  .email-editor {
    height: 100vh;
    overflow: hidden;
  }

  .editor-header {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .editor-main {
    background-color: #f8f9fa;
  }

  .editor-status {
    animation: fadeInUp 0.3s ease;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .editor-header {
      padding: 8px 12px;
    }
    
    .editor-header h1 {
      font-size: 16px;
    }
    
    .editor-main {
      height: calc(100vh - 120px);
    }
    
    .editor-status {
      bottom: 10px;
      right: 10px;
    }
  }
`;
