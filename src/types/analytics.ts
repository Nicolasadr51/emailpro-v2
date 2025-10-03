// Métriques générales d'une campagne
export interface CampaignStats {
  campaignId: string;
  totalSent: number;
  totalDelivered: number;
  totalOpened: number; // Ouvertures uniques
  totalClicked: number; // Clics uniques
  totalBounced: number;
  totalUnsubscribed: number;
  openRate: number; // (totalOpened / totalDelivered) * 100
  clickRate: number; // (totalClicked / totalDelivered) * 100
  bounceRate: number; // (totalBounced / totalSent) * 100
  unsubscribeRate: number; // (totalUnsubscribed / totalDelivered) * 100
}

// Événement de tracking individuel
export enum TrackedEvent {
  SENT = 'sent',
  DELIVERED = 'delivered',
  OPEN = 'open',
  CLICK = 'click',
  BOUNCE = 'bounce',
  UNSUBSCRIBE = 'unsubscribe',
}

export interface TrackingEvent {
  id: string;
  campaignId: string;
  contactId: string;
  event: TrackedEvent;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  url?: string; // Pour les clics
}

// Données pour les graphiques temporels
export interface TimeSeriesDataPoint {
  date: string; // Format ISO 8601
  value: number;
}

// Données pour la géolocalisation des ouvertures
export interface GeoDataPoint {
  country: string;
  count: number;
}

