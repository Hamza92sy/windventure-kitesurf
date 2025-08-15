import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes'
    ),

  email: z
    .string()
    .email('Adresse email invalide')
    .max(255, "L'email ne peut pas dépasser 255 caractères")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Format d'email invalide"
    ),

  phone: z
    .string()
    .optional()
    .refine(val => !val || /^[\+]?[0-9\s\-\(\)]{8,20}$/.test(val), {
      message: 'Numéro de téléphone invalide',
    }),

  subject: z
    .string()
    .min(5, 'Le sujet doit contenir au moins 5 caractères')
    .max(200, 'Le sujet ne peut pas dépasser 200 caractères')
    .regex(
      /^[a-zA-ZÀ-ÿ0-9\s\-_.,!?]+$/,
      'Le sujet contient des caractères non autorisés'
    ),

  message: z
    .string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères')
    .regex(
      /^[a-zA-ZÀ-ÿ0-9\s\-_.,!?@#$%&*()\[\]{}:;"'<>\/\\\n\r]+$/,
      'Le message contient des caractères non autorisés'
    ),

  recaptchaToken: z.string().min(1, 'Token reCAPTCHA requis'),

  source: z
    .string()
    .optional()
    .refine(
      val =>
        !val || ['contact', 'booking', 'homepage', 'packages'].includes(val),
      {
        message: 'Source invalide',
      }
    ),

  utm_source: z.string().max(100, 'UTM source trop long').optional(),

  utm_medium: z.string().max(100, 'UTM medium trop long').optional(),

  utm_campaign: z.string().max(100, 'UTM campaign trop long').optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Schéma pour la validation côté serveur (plus strict)
export const contactServerSchema = contactSchema.extend({
  ip: z.string().optional(),
  userAgent: z.string().optional(),
  timestamp: z.date().optional(),
});

export type ContactServerData = z.infer<typeof contactServerSchema>;
