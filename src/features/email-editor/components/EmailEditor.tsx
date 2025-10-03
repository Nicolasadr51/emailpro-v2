// Composant principal de l'éditeur d'emails
// Architecture définie par Claude 4.5 Sonnet

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEmailEditorStore } from '../../../contexts/EmailEditorContext';
import { EditorCanvas } from './EditorCanvas';
import { NewSidebar } from './NewSidebar';
import { PropertiesPanel } from './PropertiesPanel';
import { EditorToolbar } from './EditorToolbar';
import { TemplatesList } from './TemplatesList';
import { StatusIndicator, SaveStatus } from './StatusIndicator';
import { ViewModeToggle, ViewMode } from './ViewModeToggle';
import { PredefinedLayouts } from './PredefinedLayouts';
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
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [showPredefinedLayouts, setShowPredefinedLayouts] = useState(false);

  const { state, actions } = useEmailEditorStore();

  const loadTemplate = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const loadedTemplate = await emailEditorService.getTemplate(id);
      setTemplate(loadedTemplate);
      setShowTemplates(false);
    } catch (error) {
      console.error('Erreur lors du chargement du template:', error);
      // Créer un nouveau template en cas d'erreur
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
    } finally {
      setIsLoading(false);
    }
  }, [setTemplate]);

  const createNewTemplate = useCallback(() => {
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
  }, [setTemplate]);

  // Chargement du template
  useEffect(() => {
    if (templateId && templateId !== 'new') {
      loadTemplate(templateId);
    } else if (templateId === 'new') {
      createNewTemplate();
    }
  }, [templateId, loadTemplate, createNewTemplate]);

  const handleSave = useCallback(async () => {
    if (!template) return;

    setIsSaving(true);
    setSaveStatus('saving');
    
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
      setSaveStatus('saved');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [template, elements, navigate, setTemplate]);

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

  const handlePredefinedLayoutSelect = (layout: any) => {
    if (!template) return;
    
    // Créer les éléments à partir du layout prédéfini
    const newElements = layout.elements.map((element: any, index: number) => ({
      ...element,
      id: `element_${Date.now()}_${index}`,
      position: { x: 0, y: index * 100 },
      size: { width: template.layout.width, height: 'auto' }
    }));

    // Mettre à jour le template avec les nouveaux éléments
    const updatedTemplate = {
      ...template,
      elements: newElements,
      name: layout.name,
      updatedAt: new Date()
    };

    setTemplate(updatedTemplate);
    setShowPredefinedLayouts(false);
    setSaveStatus('unsaved');
  };

  const handleElementAdd = (element: any) => {
    console.log('Élément ajouté:', element);
    // TODO: Implémenter l'ajout d'élément au canvas
    // Cette fonction sera développée dans la prochaine phase
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
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

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoom, undo, redo, handleSave, setZoom]);

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
          <StatusIndicator status={saveStatus} />
          
          <ViewModeToggle 
            currentMode={viewMode}
            onModeChange={handleViewModeChange}
          />

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
        onUndo={actions.undo}
        onRedo={actions.redo}
        canUndo={state.historyIndex > 0}
        canRedo={state.historyIndex < state.history.length - 1}
        zoom={1}
        onZoomChange={() => {}}
        selectedElement={null}
      />

      {/* Interface principale */}
      <div className="editor-main" style={{
        display: 'flex',
        height: 'calc(100vh - 140px)',
        overflow: 'hidden',
      }}>
        {/* Panneau des éléments */}
        <div style={{
          width: '280px',
          borderRight: '1px solid #e0e0e0',
          backgroundColor: 'white',
          overflow: 'auto',
        }}>
          <div style={{ padding: '16px' }}>
            <div style={{ marginBottom: '20px' }}>
              <Button
                variant={showPredefinedLayouts ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowPredefinedLayouts(!showPredefinedLayouts)}
                className="w-full mb-3"
              >
                {showPredefinedLayouts ? 'Masquer les layouts' : 'Layouts prédéfinis'}
              </Button>
              
              {showPredefinedLayouts && (
                <PredefinedLayouts onLayoutSelect={handlePredefinedLayoutSelect} />
              )}
            </div>
            
            {!showPredefinedLayouts && <NewSidebar onElementAdd={handleElementAdd} />}
          </div>
        </div>

        {/* Canvas principal */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <EditorCanvas viewMode={viewMode} />
        </div>

        {/* Panneau des propriétés */}
        {showProperties && (
          <PropertiesPanel
            selectedBlockId={state.selectedBlockId}
            onUpdate={actions.updateBlock}
            template={state.template}
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
