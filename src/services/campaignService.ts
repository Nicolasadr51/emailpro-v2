// Service API pour les campagnes d'email

import { 
  Campaign, 
  CreateCampaignRequest, 
  UpdateCampaignRequest, 
  CampaignFilters, 
  CampaignListResponse,
  CampaignStats 
} from '../types/campaign';
import { apiClient, ApiRequestConfig } from './apiClient';
import { validateCampaign } from '../validation/validations';
import { mockCampaignData } from '../mocks/mockCampaignData';

// Configuration par défaut pour les requêtes de campagnes
const defaultConfig: ApiRequestConfig = {
  timeout: 15000, // 15 secondes pour les opérations de campagne
  retries: 2,
  retryDelay: 1000
};

// Service des campagnes avec gestion d'erreurs améliorée
export const campaignService = {
  // Récupérer toutes les campagnes avec filtres
  async getCampaigns(filters: CampaignFilters = {}, page?: number, limit?: number): Promise<CampaignListResponse> {

    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.type) params.append('type', Array.isArray(filters.type) ? filters.type.join(',') : filters.type);
    if (filters.status) params.append('status', Array.isArray(filters.status) ? filters.status.join(',') : filters.status);
    if (filters.dateRange) {
      params.append('dateFrom', filters.dateRange.start);
      params.append('dateTo', filters.dateRange.end);
    }
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/campaigns?${queryString}` : '/campaigns';

    try {
      return await apiClient.get<CampaignListResponse>(endpoint, defaultConfig);
    } catch (error) {
      console.error('Erreur lors de la récupération des campagnes:', error);
      // Retourner les données factices en cas d'erreur (mode développement)
      if (process.env.NODE_ENV === 'development') {
        return mockCampaignData.getCampaigns(filters);
      }
      throw error;
    }
  },

  // Récupérer une campagne par ID
  async getCampaign(id: string): Promise<Campaign> {
    if (!id) {
      throw new Error('ID de campagne requis');
    }

    try {
      return await apiClient.get<Campaign>(`/campaigns/${id}`, defaultConfig);
    } catch (error) {
      console.error(`Erreur lors de la récupération de la campagne ${id}:`, error);
      // Retourner les données factices en cas d'erreur
      if (process.env.NODE_ENV === 'development') {
        return mockCampaignData.getCampaign(id);
      }
      throw error;
    }
  },

  // Créer une nouvelle campagne
  async createCampaign(data: CreateCampaignRequest): Promise<Campaign> {
    // Validation des données
    const validationResult = validateCampaign(data);
    if (!validationResult.success) {
      throw new Error(`Données invalides: ${validationResult.errors.join(', ')}`);
    }

    try {
      return await apiClient.post<Campaign>('/campaigns', data, {
        ...defaultConfig,
        timeout: 20000 // Plus de temps pour la création
      });
    } catch (error) {
      console.error('Erreur lors de la création de la campagne:', error);
      // Simuler la création en mode développement
      if (process.env.NODE_ENV === 'development') {
        return mockCampaignData.createCampaign(data);
      }
      throw error;
    }
  },

  // Mettre à jour une campagne
  async updateCampaign(id: string, data: Partial<UpdateCampaignRequest>): Promise<Campaign> {
    if (!id) {
      throw new Error('ID de campagne requis');
    }

    try {
      return await apiClient.patch<Campaign>(`/campaigns/${id}`, data, defaultConfig);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la campagne ${id}:`, error);
      // Simuler la mise à jour en mode développement
      if (process.env.NODE_ENV === 'development') {
        return mockCampaignData.updateCampaign(id, data);
      }
      throw error;
    }
  },

  // Supprimer une campagne
  async deleteCampaign(id: string): Promise<void> {
    if (!id) {
      throw new Error('ID de campagne requis');
    }

    try {
      await apiClient.delete<void>(`/campaigns/${id}`, defaultConfig);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la campagne ${id}:`, error);
      // Simuler la suppression en mode développement
      if (process.env.NODE_ENV === 'development') {
        return mockCampaignData.deleteCampaign(id);
      }
      throw error;
    }
  },

  // Dupliquer une campagne
  async duplicateCampaign(id: string, name?: string): Promise<Campaign> {
    if (!id) {
      throw new Error('ID de campagne requis');
    }

    try {
      return await apiClient.post<Campaign>(`/campaigns/${id}/duplicate`, { name }, defaultConfig);
    } catch (error) {
      console.error(`Erreur lors de la duplication de la campagne ${id}:`, error);
      // Simuler la duplication en mode développement
      if (process.env.NODE_ENV === 'development') {
        return mockCampaignData.duplicateCampaign(id, name || `Copie de campagne ${id}`);
      }
      throw error;
    }
  },

  // Envoyer une campagne
  async sendCampaign(id: string): Promise<Campaign> {
    if (!id) {
      throw new Error('ID de campagne requis');
    }

    try {
      return await apiClient.post<Campaign>(`/campaigns/${id}/send`, undefined, {
        ...defaultConfig,
        timeout: 30000 // Plus de temps pour l'envoi
      });
    } catch (error) {
      console.error(`Erreur lors de l'envoi de la campagne ${id}:`, error);
      // Simuler l'envoi en mode développement
      if (process.env.NODE_ENV === 'development') {
        return mockCampaignData.sendCampaign(id);
      }
      throw error;
    }
  },

  // Programmer une campagne
  async scheduleCampaign(id: string, scheduledAt: string): Promise<Campaign> {
    if (!id) {
      throw new Error('ID de campagne requis');
    }
    if (!scheduledAt) {
      throw new Error('Date de programmation requise');
    }

    try {
      return await apiClient.post<Campaign>(`/campaigns/${id}/schedule`, { scheduledAt }, defaultConfig);
    } catch (error) {
      console.error(`Erreur lors de la programmation de la campagne ${id}:`, error);
      throw error;
    }
  },

  // Récupérer les statistiques d'une campagne
  async getCampaignStats(id: string): Promise<CampaignStats> {
    if (!id) {
      throw new Error('ID de campagne requis');
    }

    try {
      return await apiClient.get<CampaignStats>(`/campaigns/${id}/stats`, defaultConfig);
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques de la campagne ${id}:`, error);
      throw error;
    }
  },

  // Tester une campagne
  async testCampaign(id: string, testEmails: string[]): Promise<void> {
    if (!id) {
      throw new Error('ID de campagne requis');
    }
    if (!testEmails || testEmails.length === 0) {
      throw new Error('Au moins une adresse email de test est requise');
    }

    try {
      await apiClient.post<void>(`/campaigns/${id}/test`, { emails: testEmails }, defaultConfig);
    } catch (error) {
      console.error(`Erreur lors du test de la campagne ${id}:`, error);
      throw error;
    }
  },

  // Prévisualiser une campagne
  async previewCampaign(id: string, device: 'desktop' | 'mobile' = 'desktop'): Promise<{ html: string; text: string }> {
    if (!id) {
      throw new Error('ID de campagne requis');
    }

    try {
      return await apiClient.get<{ html: string; text: string }>(`/campaigns/${id}/preview?device=${device}`, defaultConfig);
    } catch (error) {
      console.error(`Erreur lors de la prévisualisation de la campagne ${id}:`, error);
      throw error;
    }
  }
};

