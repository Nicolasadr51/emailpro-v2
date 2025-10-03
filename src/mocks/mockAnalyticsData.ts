import { CampaignStats, TrackingEvent, TimeSeriesDataPoint, GeoDataPoint, TrackedEvent } from '../types/analytics';

const generateRandomId = () => `mock-${Math.random().toString(36).substr(2, 9)}`;

// Données de statistiques de campagne factices
const mockCampaignStats: CampaignStats[] = [
  {
    campaignId: 'campaign-1',
    totalSent: 1000,
    totalDelivered: 950,
    totalOpened: 380,
    totalClicked: 95,
    totalBounced: 50,
    totalUnsubscribed: 12,
    openRate: 40.0,
    clickRate: 10.0,
    bounceRate: 5.0,
    unsubscribeRate: 1.26,
  },
  {
    campaignId: 'campaign-2',
    totalSent: 2500,
    totalDelivered: 2400,
    totalOpened: 960,
    totalClicked: 240,
    totalBounced: 100,
    totalUnsubscribed: 24,
    openRate: 40.0,
    clickRate: 10.0,
    bounceRate: 4.0,
    unsubscribeRate: 1.0,
  },
];

// Données de séries temporelles factices
const mockTimeSeriesData: { [key: string]: TimeSeriesDataPoint[] } = {
  'campaign-1-opens': [
    { date: '2024-10-01T00:00:00Z', value: 45 },
    { date: '2024-10-01T01:00:00Z', value: 62 },
    { date: '2024-10-01T02:00:00Z', value: 38 },
    { date: '2024-10-01T03:00:00Z', value: 29 },
    { date: '2024-10-01T04:00:00Z', value: 15 },
    { date: '2024-10-01T05:00:00Z', value: 8 },
    { date: '2024-10-01T06:00:00Z', value: 12 },
    { date: '2024-10-01T07:00:00Z', value: 25 },
    { date: '2024-10-01T08:00:00Z', value: 42 },
    { date: '2024-10-01T09:00:00Z', value: 58 },
    { date: '2024-10-01T10:00:00Z', value: 46 },
  ],
  'campaign-1-clicks': [
    { date: '2024-10-01T00:00:00Z', value: 12 },
    { date: '2024-10-01T01:00:00Z', value: 18 },
    { date: '2024-10-01T02:00:00Z', value: 9 },
    { date: '2024-10-01T03:00:00Z', value: 7 },
    { date: '2024-10-01T04:00:00Z', value: 3 },
    { date: '2024-10-01T05:00:00Z', value: 2 },
    { date: '2024-10-01T06:00:00Z', value: 4 },
    { date: '2024-10-01T07:00:00Z', value: 8 },
    { date: '2024-10-01T08:00:00Z', value: 14 },
    { date: '2024-10-01T09:00:00Z', value: 18 },
    { date: '2024-10-01T10:00:00Z', value: 12 },
  ],
};

// Données de géolocalisation factices
const mockGeoData: GeoDataPoint[] = [
  { country: 'France', count: 150 },
  { country: 'Canada', count: 85 },
  { country: 'Belgique', count: 62 },
  { country: 'Suisse', count: 45 },
  { country: 'États-Unis', count: 38 },
  { country: 'Allemagne', count: 28 },
  { country: 'Espagne', count: 22 },
  { country: 'Italie', count: 18 },
  { country: 'Royaume-Uni', count: 15 },
  { country: 'Pays-Bas', count: 12 },
];

// Événements de tracking factices
const mockTrackingEvents: TrackingEvent[] = [
  {
    id: generateRandomId(),
    campaignId: 'campaign-1',
    contactId: 'contact-1',
    event: TrackedEvent.OPEN,
    timestamp: new Date('2024-10-01T10:30:00Z').toISOString(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  },
  {
    id: generateRandomId(),
    campaignId: 'campaign-1',
    contactId: 'contact-2',
    event: TrackedEvent.CLICK,
    timestamp: new Date('2024-10-01T10:35:00Z').toISOString(),
    ipAddress: '192.168.1.2',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    url: 'https://example.com/product',
  },
];

export const mockAnalyticsData = {
  campaignStats: mockCampaignStats,
  timeSeriesData: mockTimeSeriesData,
  geoData: mockGeoData,
  trackingEvents: mockTrackingEvents,

  getCampaignStats(campaignId: string): CampaignStats {
    const stats = this.campaignStats.find(s => s.campaignId === campaignId);
    if (!stats) {
      throw new Error('Statistiques de campagne non trouvées');
    }
    return stats;
  },

  getTimeSeriesData(campaignId: string, metric: 'opens' | 'clicks'): TimeSeriesDataPoint[] {
    const key = `${campaignId}-${metric}`;
    return this.timeSeriesData[key] || [];
  },

  getGeoData(campaignId: string): GeoDataPoint[] {
    // Pour la démo, on retourne les mêmes données pour toutes les campagnes
    return this.geoData;
  },

  trackEvent(eventData: Omit<TrackingEvent, 'id' | 'timestamp'>): void {
    const newEvent: TrackingEvent = {
      id: generateRandomId(),
      timestamp: new Date().toISOString(),
      ...eventData,
    };
    this.trackingEvents.push(newEvent);
  },
};
