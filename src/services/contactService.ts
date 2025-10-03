import { apiClient } from './apiClient';
import { Contact, CreateContactRequest, UpdateContactRequest, ContactFilters, ContactListFilters, ContactListResponse, ContactListsResponse, CreateContactListRequest, UpdateContactListRequest, ContactList } from "../types/contact";
import { ValidationError, NotFoundError, NetworkError, ServerError } from '../types/errors';
import { validateContact, validateContactList } from '../validation/validations';
import { mockContactData } from '../mocks/mockContactData';

const handleApiError = (error: unknown, context: string): never => {
  if (error instanceof Error) {
    if (error.message.includes('404')) {
      throw new NotFoundError(`${context} non trouvé(e)`, context);
    }
    if (error.message.includes('401') || error.message.includes('403')) {
      throw new Error('Non autorisé');
    }
    if (error.message.includes('Network')) {
      throw new NetworkError(`Erreur réseau lors de ${context}`, 'NETWORK_ERROR');
    }
    if (error.message.includes('500')) {
      throw new ServerError(`Erreur serveur lors de ${context}`, 'SERVER_ERROR');
    }
  }
  throw new Error(`Erreur lors de ${context}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
};

export const contactService = {
  // --- Contacts ---
  async getContacts(filters: ContactFilters = {}, page?: number, limit?: number): Promise<ContactListResponse> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return mockContactData.getContacts(filters, page, limit);
      }
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', Array.isArray(filters.status) ? filters.status.join(',') : filters.status);
      if (filters.listIds) params.append('listIds', filters.listIds.join(','));
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());

      const queryString = params.toString();
      const endpoint = queryString ? `/contacts?${queryString}` : '/contacts';
      return apiClient.get<ContactListResponse>(endpoint);
    } catch (error) {
      handleApiError(error, 'récupération des contacts');
    }
  },

  async getContact(id: string): Promise<Contact> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return mockContactData.getContact(id);
      }
      return apiClient.get<Contact>(`/contacts/${id}`);
    } catch (error) {
      handleApiError(error, 'récupération du contact');
    }
  },

  async createContact(data: CreateContactRequest): Promise<Contact> {
    try {
      const validationResult = validateContact(data);
      if (!validationResult.success) {
        throw new ValidationError(
          `Données invalides: ${validationResult.errors.join(', ')}`,
          'contact',
          validationResult.errors.join(', ')
        );
      }
      if (process.env.NODE_ENV === 'development') {
        return mockContactData.createContact(data);
      }
      return apiClient.post<Contact>('/contacts', data);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      handleApiError(error, 'création du contact');
    }
  },

  async updateContact(id: string, data: UpdateContactRequest): Promise<Contact> {
    try {
      const validationResult = validateContact(data);
      if (!validationResult.success) {
        throw new ValidationError(
          `Données invalides: ${validationResult.errors.join(', ')}`,
          'contact',
          validationResult.errors.join(', ')
        );
      }
      if (process.env.NODE_ENV === 'development') {
        return mockContactData.updateContact(id, data);
      }
      return apiClient.put<Contact>(`/contacts/${id}`, data);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      handleApiError(error, 'mise à jour du contact');
    }
  },

  async deleteContact(id: string): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return mockContactData.deleteContact(id);
      }
      return apiClient.delete<void>(`/contacts/${id}`);
    } catch (error) {
      handleApiError(error, 'suppression du contact');
    }
  },

  // --- Contact Lists ---
  async getContactLists(filters: ContactListFilters = {}, page?: number, limit?: number): Promise<ContactListsResponse> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return mockContactData.getContactLists(filters, page, limit);
      }
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());

      const queryString = params.toString();
      const endpoint = queryString ? `/contact-lists?${queryString}` : '/contact-lists';
      return apiClient.get<ContactListsResponse>(endpoint);
    } catch (error) {
      handleApiError(error, 'récupération des listes de contacts');
    }
  },

  async getContactList(id: string): Promise<ContactList> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return mockContactData.getContactList(id);
      }
      return apiClient.get<ContactList>(`/contact-lists/${id}`);
    } catch (error) {
      handleApiError(error, 'récupération de la liste de contacts');
    }
  },

  async createContactList(data: CreateContactListRequest): Promise<ContactList> {
    try {
      const validationResult = validateContactList(data);
      if (!validationResult.success) {
        throw new ValidationError(
          `Données invalides: ${validationResult.errors.join(', ')}`,
          'contactList',
          validationResult.errors.join(', ')
        );
      }
      if (process.env.NODE_ENV === 'development') {
        return mockContactData.createContactList(data);
      }
      return apiClient.post<ContactList>('/contact-lists', data);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      handleApiError(error, 'création de la liste de contacts');
    }
  },

  async updateContactList(id: string, data: UpdateContactListRequest): Promise<ContactList> {
    try {
      const validationResult = validateContactList(data);
      if (!validationResult.success) {
        throw new ValidationError(
          `Données invalides: ${validationResult.errors.join(', ')}`,
          'contactList',
          validationResult.errors.join(', ')
        );
      }
      if (process.env.NODE_ENV === 'development') {
        return mockContactData.updateContactList(id, data);
      }
      return apiClient.put<ContactList>(`/contact-lists/${id}`, data);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      handleApiError(error, 'mise à jour de la liste de contacts');
    }
  },

  async deleteContactList(id: string): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return mockContactData.deleteContactList(id);
      }
      return apiClient.delete<void>(`/contact-lists/${id}`);
    } catch (error) {
      handleApiError(error, 'suppression de la liste de contacts');
    }
  },
};
