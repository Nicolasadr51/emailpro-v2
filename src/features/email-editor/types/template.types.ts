// Types pour la gestion des templates d'emails
// Architecture définie par Claude 4.5 Sonnet

import { EmailTemplate, TemplateCategory, TemplatePreview } from './editor.types';

export interface CreateTemplateRequest {
  name: string;
  subject: string;
  preheader?: string;
  layout: {
    width: number;
    height: number;
    backgroundColor: string;
  };
  blocks: any[]; // Using any[] for now to avoid circular dependency with EmailBlock
  globalStyles: any; // Using any for now
  createdAt: string;
  updatedAt: string;
  version: string;
  description?: string;
  category?: string;
  isPublic?: boolean;
}

export interface UpdateTemplateRequest {
  name?: string;
  subject?: string;
  preheader?: string;
  layout?: {
    width?: number;
    height?: number;
    backgroundColor?: string;
  };
  blocks?: any[]; // Using any[] for now to avoid circular dependency with EmailBlock
  globalStyles?: any; // Using any for now
  createdAt?: string;
  updatedAt?: string;
  version?: string;
  description?: string;
  category?: string;
  isPublic?: boolean;
}

export interface TemplateFilters {
  category?: string;
  isPublic?: boolean;
  search?: string;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface TemplateListResponse {
  templates: TemplatePreview[];
  total: number;
  page: number;
  limit: number;
  categories: TemplateCategory[];
}

export interface TemplateStats {
  totalTemplates: number;
  publicTemplates: number;
  privateTemplates: number;
  categoriesCount: number;
  mostUsedCategory: string;
}

// Types pour l'export/import de templates
export interface ExportTemplateData {
  template: EmailTemplate;
  version: string;
  exportedAt: Date;
  metadata: {
    appVersion: string;
    exportFormat: 'json' | 'html';
  };
}

export interface ImportTemplateResult {
  success: boolean;
  template?: EmailTemplate;
  errors?: string[];
  warnings?: string[];
}

// Types pour les templates prédéfinis du système
export interface SystemTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  elements: any[];
  layout: any;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // en minutes
}

export interface TemplateLibrary {
  categories: TemplateCategory[];
  featured: SystemTemplate[];
  recent: SystemTemplate[];
  popular: SystemTemplate[];
}
