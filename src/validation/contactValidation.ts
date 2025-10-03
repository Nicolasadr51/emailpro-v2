import { z } from 'zod';

export const contactSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom de famille doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  status: z.enum(['Subscribed', 'Unsubscribed', 'Pending']), 
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const contactListSchema = z.array(contactSchema);

