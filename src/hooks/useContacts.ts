import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactService } from '../services/contactService';
import { Contact, CreateContactRequest, UpdateContactRequest, ContactFilters, ContactListResponse, ContactListsResponse } from '../types/contact';
import { AppError, createAppError } from '../types/errors';
import { useNotifications } from '../store/useAppStore';

export const useContacts = (filters: ContactFilters = {}, page: number = 1, limit: number = 10) => {
  return useQuery<ContactListResponse, AppError>({
    queryKey: ["contacts", filters, page, limit],
    queryFn: async () => {
      try {
        return await contactService.getContacts(filters, page, limit);
      } catch (error) {
        throw createAppError(error);
      }
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useContact = (id: string) => {
  return useQuery<Contact, AppError>({
    queryKey: ["contact", id],
    queryFn: async () => {
      try {
        return await contactService.getContact(id);
      } catch (error) {
        throw createAppError(error);
      }
    },
    enabled: !!id
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation<Contact, Error, CreateContactRequest>({
    mutationFn: (newContact) => {
      return contactService.createContact(newContact);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      addNotification({ 
        type: "success",
        title: "Succès", 
        message: "Contact créé avec succès"
      });
    },
    onError: (error: Error) => {
      addNotification({ 
        type: "error",
        title: "Erreur", 
        message: error.message
      });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation<Contact, Error, { id: string; data: UpdateContactRequest }>({
    mutationFn: ({ id, data }) => {
      return contactService.updateContact(id, data);
    },
    onSuccess: (updatedContact) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact', updatedContact.id] });
      addNotification({ 
        type: 'success',
        title: 'Succès', 
        message: 'Contact mis à jour avec succès'
      });
    },
    onError: (error: Error) => {
      addNotification({ 
        type: 'error',
        title: 'Erreur', 
        message: error.message
      });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation<void, Error, string>({
    mutationFn: (id) => {
      return contactService.deleteContact(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      addNotification({ 
        type: 'success',
        title: 'Succès', 
        message: 'Contact supprimé avec succès'
      });
    },
    onError: (error: Error) => {
      addNotification({ 
        type: 'error',
        title: 'Erreur', 
        message: error.message
      });
    },
  });
};

export const useContactLists = (filters: ContactFilters = {}, page: number = 1, limit: number = 10) => {
  return useQuery<ContactListsResponse, AppError>({
    queryKey: ["contactLists", filters, page, limit],
    queryFn: async () => {
      try {
        return await contactService.getContactLists(filters, page, limit);
      } catch (error) {
        throw createAppError(error);
      }
    },
    placeholderData: (previousData) => previousData,
  });
};
