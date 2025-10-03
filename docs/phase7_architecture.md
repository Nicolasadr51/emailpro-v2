## Phase 7 : Conception et Architecture - Analytics et Statistiques

### 1. Objectifs

L'objectif de cette phase est de doter EmailPro v2 d'un système d'analyse et de statistiques complet pour suivre les performances des campagnes d'emailing. Les utilisateurs doivent pouvoir visualiser des métriques clés, comprendre l'engagement de leur audience et prendre des décisions éclairées pour optimiser leurs futures campagnes.

### 2. Modèles de Données (Types)

Nous allons définir les interfaces TypeScript nécessaires pour représenter les données analytiques.

**`src/types/analytics.ts`**

```typescript
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
```

### 3. Services et API

Le `analyticsService` sera responsable de la communication avec le backend pour la collecte et la récupération des données.

**`src/services/analyticsService.ts`**

```typescript
import { apiClient } from './apiClient';
import { CampaignStats, TrackingEvent, TimeSeriesDataPoint, GeoDataPoint } from '../types/analytics';

// Enregistrer un événement de tracking
const trackEvent = async (eventData: Omit<TrackingEvent, 'id' | 'timestamp'>): Promise<void> => {
  await apiClient.post('/analytics/track', eventData);
};

// Obtenir les statistiques d'une campagne
const getCampaignStats = async (campaignId: string): Promise<CampaignStats> => {
  return await apiClient.get(`/analytics/campaigns/${campaignId}/stats`);
};

// Obtenir les données temporelles pour une métrique (ouvertures, clics)
const getTimeSeriesData = async (campaignId: string, metric: 'opens' | 'clicks'): Promise<TimeSeriesDataPoint[]> => {
  return await apiClient.get(`/analytics/campaigns/${campaignId}/timeseries?metric=${metric}`);
};

// Obtenir les données de géolocalisation des ouvertures
const getGeoData = async (campaignId: string): Promise<GeoDataPoint[]> => {
  return await apiClient.get(`/analytics/campaigns/${campaignId}/geo`);
};

export const analyticsService = {
  trackEvent,
  getCampaignStats,
  getTimeSeriesData,
  getGeoData,
};
```

### 4. Hooks React Query

Des hooks personnalisés simplifieront l'accès aux données analytiques dans les composants.

**`src/hooks/useAnalytics.ts`**

```typescript
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
```

### 5. Composants Frontend

La page de statistiques sera composée de plusieurs sous-composants réutilisables.

- **`src/pages/StatisticsPage.tsx`**: Page principale qui orchestrera l'affichage des différents widgets.
- **`src/components/analytics/StatCard.tsx`**: Carte pour afficher une métrique clé (ex: Taux d'ouverture).
- **`src/components/analytics/TimeSeriesChart.tsx`**: Graphique linéaire pour visualiser l'évolution des ouvertures/clics dans le temps (utilisera une librairie comme `recharts` ou `chart.js`).
- **`src/components/analytics/GeoChart.tsx`**: Carte du monde pour visualiser la répartition géographique des ouvertures (utilisera une librairie comme `react-simple-maps`).
- **`src/components/analytics/RecentActivityFeed.tsx`**: Flux en temps réel des derniers événements (ouvertures, clics).

### 6. Backend et Base de Données (Considérations)

- **Collecte d'événements :** Un pixel de tracking (image 1x1 transparente) sera inséré dans chaque email pour suivre les ouvertures. Les liens seront réécrits pour passer par un service de redirection qui enregistrera les clics.
- **Base de données :** Une base de données optimisée pour les écritures rapides et les agrégations sera nécessaire. Des solutions comme **ClickHouse** ou **TimescaleDB** (une extension PostgreSQL) sont d'excellents candidats. Pour une première version, une table PostgreSQL standard peut suffire, mais il faudra prévoir une migration si le volume de données augmente.
- **Schéma de la table `tracking_events`:**
  - `id` (UUID, Clé primaire)
  - `campaign_id` (UUID, Index)
  - `contact_id` (UUID, Index)
  - `event_type` (Enum: 'open', 'click', etc., Index)
  - `timestamp` (Timestamp, Index)
  - `ip_address` (String)
  - `user_agent` (String)
  - `url` (String, pour les clics)
  - `country_code` (String, pour la géolocalisation)

- **Agrégation :** Des tâches en arrière-plan (cron jobs) pourront pré-agréger les données pour accélérer l'affichage des statistiques dans les tableaux de bord.

