import { apiClient } from './apiClient';
import { CampaignStats, TrackingEvent, TimeSeriesDataPoint, GeoDataPoint } from '../types/analytics';
import { mockAnalyticsData } from '../mocks/mockAnalyticsData';

// Enregistrer un événement de tracking
const trackEvent = async (eventData: Omit<TrackingEvent, 'id' | 'timestamp'>): Promise<void> => {
  // En mode développement, utiliser les données de mock
  if (process.env.NODE_ENV === 'development') {
    mockAnalyticsData.trackEvent(eventData);
    return;
  }
  await apiClient.post('/analytics/track', eventData);
};

// Obtenir les statistiques d'une campagne
const getCampaignStats = async (campaignId: string): Promise<CampaignStats> => {
  // En mode développement, utiliser les données de mock
  if (process.env.NODE_ENV === 'development') {
    return mockAnalyticsData.getCampaignStats(campaignId);
  }
  return await apiClient.get(`/analytics/campaigns/${campaignId}/stats`);
};

// Obtenir les données temporelles pour une métrique (ouvertures, clics)
const getTimeSeriesData = async (campaignId: string, metric: 'opens' | 'clicks'): Promise<TimeSeriesDataPoint[]> => {
  // En mode développement, utiliser les données de mock
  if (process.env.NODE_ENV === 'development') {
    return mockAnalyticsData.getTimeSeriesData(campaignId, metric);
  }
  return await apiClient.get(`/analytics/campaigns/${campaignId}/timeseries?metric=${metric}`);
};

// Obtenir les données de géolocalisation des ouvertures
const getGeoData = async (campaignId: string): Promise<GeoDataPoint[]> => {
  // En mode développement, utiliser les données de mock
  if (process.env.NODE_ENV === 'development') {
    return mockAnalyticsData.getGeoData(campaignId);
  }
  return await apiClient.get(`/analytics/campaigns/${campaignId}/geo`);
};

export const analyticsService = {
  trackEvent,
  getCampaignStats,
  getTimeSeriesData,
  getGeoData,
};

