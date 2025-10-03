import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';

export const useCampaignStats = (campaignId: string) => {
  return useQuery({
    queryKey: ['campaignStats', campaignId],
    queryFn: () => analyticsService.getCampaignStats(campaignId),
    enabled: !!campaignId,
  });
};

export const useTimeSeriesData = (campaignId: string, metric: 'opens' | 'clicks') => {
  return useQuery({
    queryKey: ['timeSeriesData', campaignId, metric],
    queryFn: () => analyticsService.getTimeSeriesData(campaignId, metric),
    enabled: !!campaignId,
  });
};

export const useGeoData = (campaignId: string) => {
  return useQuery({
    queryKey: ['geoData', campaignId],
    queryFn: () => analyticsService.getGeoData(campaignId),
    enabled: !!campaignId,
  });
};

