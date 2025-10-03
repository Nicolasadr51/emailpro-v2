// Service pour l'éditeur d'emails
// Architecture définie par Claude 4.5 Sonnet

import { apiClient } from '../../../services/apiClient';
import { EmailTemplate, EditorElement } from '../types/editor.types';
import { CreateTemplateRequest, UpdateTemplateRequest, TemplateFilters, TemplateListResponse } from '../types/template.types';

export const emailEditorService = {
  // Gestion des templates
  async saveTemplate(template: CreateTemplateRequest): Promise<EmailTemplate> {
    try {
      const response = await apiClient.post<EmailTemplate>('/api/templates', template);
      return response;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du template:', error);
      throw error;
    }
  },

  async getTemplate(id: string): Promise<EmailTemplate> {
    try {
      const response = await apiClient.get<EmailTemplate>(`/api/templates/${id}`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération du template:', error);
      throw error;
    }
  },

  async updateTemplate(id: string, updates: UpdateTemplateRequest): Promise<EmailTemplate> {
    try {
      const response = await apiClient.patch<EmailTemplate>(`/api/templates/${id}`, updates);
      return response;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du template:', error);
      throw error;
    }
  },

  async deleteTemplate(id: string): Promise<void> {
    try {
      await apiClient.delete<void>(`/api/templates/${id}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du template:', error);
      throw error;
    }
  },

  async getTemplates(filters: TemplateFilters = {}): Promise<TemplateListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.isPublic !== undefined) queryParams.append('isPublic', filters.isPublic.toString());
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const url = `/api/templates${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get<TemplateListResponse>(url);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des templates:', error);
      throw error;
    }
  },

  // Gestion des éléments
  async updateElement(
    templateId: string,
    elementId: string,
    updates: Partial<EditorElement>
  ): Promise<EditorElement> {
    try {
      const response = await apiClient.patch<EditorElement>(
        `/api/templates/${templateId}/elements/${elementId}`,
        updates
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'élément:', error);
      throw error;
    }
  },

  async addElement(templateId: string, element: Omit<EditorElement, 'id'>): Promise<EditorElement> {
    try {
      const response = await apiClient.post<EditorElement>(
        `/api/templates/${templateId}/elements`,
        element
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'élément:', error);
      throw error;
    }
  },

  async deleteElement(templateId: string, elementId: string): Promise<void> {
    try {
      await apiClient.delete<void>(`/api/templates/${templateId}/elements/${elementId}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'élément:', error);
      throw error;
    }
  },

  // Export/Import
  async exportTemplate(id: string, format: 'json' | 'html' = 'json'): Promise<Blob> {
    try {
      const response = await fetch(`/api/templates/${id}/export?format=${format}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'export du template');
      }

      return await response.blob();
    } catch (error) {
      console.error('Erreur lors de l\'export du template:', error);
      throw error;
    }
  },

  async importTemplate(file: File): Promise<EmailTemplate> {
    try {
      const formData = new FormData();
      formData.append('template', file);

      const response = await fetch('/api/templates/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'import du template');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'import du template:', error);
      throw error;
    }
  },

  // Prévisualisation
  async generatePreview(templateId: string): Promise<string> {
    try {
      const response = await apiClient.post<{ previewUrl: string }>(
        `/api/templates/${templateId}/preview`
      );
      return response.previewUrl;
    } catch (error) {
      console.error('Erreur lors de la génération de la prévisualisation:', error);
      throw error;
    }
  },

  // Duplication
  async duplicateTemplate(id: string, newName?: string): Promise<EmailTemplate> {
    try {
      const response = await apiClient.post<EmailTemplate>(`/api/templates/${id}/duplicate`, { name: newName });
      return response;
    } catch (error) {
      console.error('Erreur lors de la duplication du template:', error);
      throw error;
    }
  },
};

// Service pour les templates système/prédéfinis
export const systemTemplateService = {
  async getSystemTemplates(): Promise<EmailTemplate[]> {
    try {
      const response = await apiClient.get<EmailTemplate[]>('/api/system-templates');
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des templates système:', error);
      // Retourner des templates par défaut en cas d'erreur
      return [];
    }
  },

  async getTemplateCategories(): Promise<string[]> {
    try {
      const response = await apiClient.get<string[]>('/api/template-categories');
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      return ['Newsletter', 'Promotion', 'Transactionnel', 'Événement'];
    }
  },
};
