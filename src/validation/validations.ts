// Validations temporaires avec TypeScript natif
// TODO: Corriger Zod plus tard

import { CreateCampaignRequest } from '../types/campaign';
import { CreateContactRequest, CreateContactListRequest } from '../types/contact';

// Types pour les validations
export interface ValidationResult {
  success: boolean;
  errors: string[];
}

// Validation des campagnes
export const validateCampaign = (data: Partial<CreateCampaignRequest>): ValidationResult => {
  const errors: string[] = [];

  // Validation du nom
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Le nom de la campagne est requis');
  } else if (data.name.length > 100) {
    errors.push('Le nom ne peut pas dépasser 100 caractères');
  }

  // Validation du sujet
  if (!data.subject || data.subject.trim().length === 0) {
    errors.push('Le sujet est requis');
  } else if (data.subject.length > 200) {
    errors.push('Le sujet ne peut pas dépasser 200 caractères');
  }

  // Validation du type
  const validTypes = ['regular', 'automated', 'transactional'];
  if (!data.type || !validTypes.includes(data.type)) {
    errors.push('Type de campagne invalide');
  }

  // Validation de la date de programmation
  if (data.scheduledAt) {
    const scheduledDate = new Date(data.scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      errors.push('Date de programmation invalide');
    } else if (scheduledDate <= new Date()) {
      errors.push('La date de programmation doit être dans le futur');
    }
  }

  // Validation des destinataires
  if (!data.recipients || !data.recipients.listIds || data.recipients.listIds.length === 0) {
    errors.push('Au moins une liste de contacts est requise');
  }

  // Validation du contenu
  if (!data.content) {
    errors.push('Le contenu de la campagne est requis');
  } else {
    if (!data.content.html || data.content.html.trim().length === 0) {
      errors.push('Le contenu HTML est requis');
    }
    if (!data.content.text || data.content.text.trim().length === 0) {
      errors.push('Le contenu texte est requis');
    }
  }

  // Validation des paramètres
  if (!data.settings) {
    errors.push('Les paramètres de la campagne sont requis');
  } else {
    if (!data.settings.fromName || data.settings.fromName.trim().length === 0) {
      errors.push('Le nom de l\'expéditeur est requis');
    }
    if (!data.settings.fromEmail || !isValidEmail(data.settings.fromEmail)) {
      errors.push('L\'email de l\'expéditeur est requis et doit être valide');
    }
    if (!data.settings.replyTo || !isValidEmail(data.settings.replyTo)) {
      errors.push('L\'email de réponse est requis et doit être valide');
    }
  }

  return {
    success: errors.length === 0,
    errors
  };
};

// Validation des contacts
export const validateContact = (data: Partial<CreateContactRequest>): ValidationResult => {
  const errors: string[] = [];

  // Validation de l'email
  if (!data.email || data.email.trim().length === 0) {
    errors.push('L\'email est requis');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Format d\'email invalide');
    }
  }

  // Validation du prénom
  if (data.firstName && data.firstName.length > 50) {
    errors.push('Le prénom ne peut pas dépasser 50 caractères');
  }

  // Validation du nom
  if (data.lastName && data.lastName.length > 50) {
    errors.push('Le nom ne peut pas dépasser 50 caractères');
  }

  // Validation des préférences
  if (data.preferences) {
    if (data.preferences.language && data.preferences.language.length > 50) {
      errors.push('La langue ne peut pas dépasser 50 caractères');
    }
    if (data.preferences.timezone && data.preferences.timezone.length > 50) {
      errors.push('Le fuseau horaire ne peut pas dépasser 50 caractères');
    }
    const validEmailFormats = ['html', 'text'];
    if (data.preferences.emailFormat && !validEmailFormats.includes(data.preferences.emailFormat)) {
      errors.push('Format d\'email préféré invalide');
    }
  }

  return {
    success: errors.length === 0,
    errors
  };
};

// Validation des listes de contacts
export const validateContactList = (data: Partial<CreateContactListRequest>): ValidationResult => {
  const errors: string[] = [];

  // Validation du nom
  if (!data.name || data.name.trim().length === 0) {
    errors.push('Le nom de la liste est requis');
  } else if (data.name.length > 100) {
    errors.push('Le nom ne peut pas dépasser 100 caractères');
  }

  // Validation de la description
  if (data.description && data.description.length > 500) {
    errors.push('La description ne peut pas dépasser 500 caractères');
  }

  return {
    success: errors.length === 0,
    errors
  };
};

// Validation de l'authentification
export const validateAuth = (data: { email?: string; password?: string }): ValidationResult => {
  const errors: string[] = [];

  // Validation de l'email
  if (!data.email || data.email.trim().length === 0) {
    errors.push('L\'email est requis');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Format d\'email invalide');
    }
  }

  // Validation du mot de passe
  if (!data.password || data.password.length === 0) {
    errors.push('Le mot de passe est requis');
  } else if (data.password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }

  return {
    success: errors.length === 0,
    errors
  };
};

// Validation de l'inscription
export const validateRegister = (data: { 
  email?: string; 
  password?: string; 
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
}): ValidationResult => {
  const errors: string[] = [];

  // Validation de base de l'auth
  const authValidation = validateAuth(data);
  errors.push(...authValidation.errors);

  // Validation de la confirmation du mot de passe
  if (data.password !== data.confirmPassword) {
    errors.push('Les mots de passe ne correspondent pas');
  }

  // Validation du prénom
  if (!data.firstName || data.firstName.trim().length === 0) {
    errors.push('Le prénom est requis');
  } else if (data.firstName.length > 50) {
    errors.push('Le prénom ne peut pas dépasser 50 caractères');
  }

  // Validation du nom
  if (!data.lastName || data.lastName.trim().length === 0) {
    errors.push('Le nom est requis');
  } else if (data.lastName.length > 50) {
    errors.push('Le nom ne peut pas dépasser 50 caractères');
  }

  return {
    success: errors.length === 0,
    errors
  };
};

// Utilitaires de validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidDate = (date: string): boolean => {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

export const isFutureDate = (date: string): boolean => {
  const parsedDate = new Date(date);
  return parsedDate > new Date();
};

// Types dérivés pour TypeScript (remplace les types Zod)
export type CampaignValidation = ReturnType<typeof validateCampaign>;
export type ContactValidation = ReturnType<typeof validateContact>;
export type ContactListValidation = ReturnType<typeof validateContactList>;
export type AuthValidation = ReturnType<typeof validateAuth>;
export type RegisterValidation = ReturnType<typeof validateRegister>;
