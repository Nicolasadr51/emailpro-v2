export interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  status: ContactStatus;
  tags: string[];
  customFields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  lastActivityAt?: string;
  listIds?: string[];
  
  // Statistiques
  stats: {
    emailsSent: number;
    emailsOpened: number;
    emailsClicked: number;
    lastOpenedAt?: string;
    lastClickedAt?: string;
  };
  
  // Préférences
  preferences?: {
    language?: string;
    timezone?: string;
    emailFormat?: 'html' | 'text';
  };
}

export type ContactStatus = 
  | 'subscribed'
  | 'unsubscribed'
  | 'bounced'
  | 'complained'
  | 'pending';

export interface ContactList {
  id: string;
  name: string;
  description?: string;
  contactCount: number;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
  tags: string[];
}

export interface ContactSegment {
  id: string;
  name: string;
  description?: string;
  conditions: SegmentCondition[];
  contactCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SegmentCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value: string | number | boolean;
  logicalOperator?: 'and' | 'or';
}

export interface CreateContactRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  status?: ContactStatus;
  tags?: string[];
  customFields?: Record<string, any>;
  listIds?: string[];
  preferences?: {
    language?: string;
    timezone?: string;
    emailFormat?: 'html' | 'text';
  };
}

export interface UpdateContactRequest extends Partial<CreateContactRequest> {
  id: string;
}

export interface ImportContactsRequest {
  file: File;
  listId: string;
  mapping: Record<string, string>;
  updateExisting: boolean;
}

export interface ContactFilters {
  status?: ContactStatus[];
  listIds?: string[];
  tags?: string[];
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ContactListResponse {
  data: Contact[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  hasMore: boolean;
}

export interface ContactListsResponse {
  data: ContactList[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  hasMore: boolean;
}


export interface ContactListFilters {
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}



export interface CreateContactListRequest {
  name: string;
  description?: string;
  tags?: string[];
}



export interface UpdateContactListRequest extends Partial<CreateContactListRequest> {
  id: string;
}

