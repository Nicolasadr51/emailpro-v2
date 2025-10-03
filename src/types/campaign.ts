export interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: CampaignStatus;
  type: CampaignType;
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  sentAt?: string;
  
  // Contenu
  content: {
    html: string;
    text: string;
    templateId?: string;
  };
  
  // Destinataires
  recipients: {
    listIds: string[];
    segmentIds: string[];
    totalCount: number;
  };
  
  // Paramètres
  settings: {
    fromName: string;
    fromEmail: string;
    replyTo: string;
    trackOpens: boolean;
    trackClicks: boolean;
    enableAnalytics: boolean;
  };
  
  // Statistiques
  stats?: CampaignStats;
}

export type CampaignStatus = 
  | 'draft'
  | 'scheduled'
  | 'sending'
  | 'sent'
  | 'paused'
  | 'cancelled'
  | 'failed';

export type CampaignType = 
  | 'regular'
  | 'automation'
  | 'ab_test'
  | 'rss';

export interface CampaignStats {
  sent: number;
  delivered: number;
  opens: number;
  clicks: number;
  unsubscribes: number;
  bounces: number;
  complaints: number;
  
  // Taux calculés
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  unsubscribeRate: number;
  bounceRate: number;
  complaintRate: number;
}

export interface CreateCampaignRequest {
  name: string;
  subject: string;
  type: CampaignType;
  content: {
    html: string;
    text: string;
    templateId?: string;
  };
  recipients: {
    listIds: string[];
    segmentIds: string[];
  };
  settings: {
    fromName: string;
    fromEmail: string;
    replyTo: string;
    trackOpens: boolean;
    trackClicks: boolean;
    enableAnalytics: boolean;
  };
  scheduledAt?: string;
}

export interface UpdateCampaignRequest extends Partial<CreateCampaignRequest> {
  id: string;
}

export interface CampaignFilters {
  status?: CampaignStatus[];
  type?: CampaignType[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface CampaignListResponse {
  campaigns: Campaign[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
