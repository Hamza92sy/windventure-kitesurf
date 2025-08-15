import { z } from 'zod';

export const checkoutSchema = z.object({
  packageId: z
    .string()
    .min(1, 'ID du package requis')
    .max(50, 'ID du package trop long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'ID du package invalide'),

  customerName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes'
    ),

  customerEmail: z
    .string()
    .email('Adresse email invalide')
    .max(255, "L'email ne peut pas dépasser 255 caractères"),

  customerPhone: z
    .string()
    .min(8, 'Numéro de téléphone requis')
    .max(20, 'Numéro de téléphone trop long')
    .regex(/^[\+]?[0-9\s\-\(\)]{8,20}$/, 'Numéro de téléphone invalide'),

  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)')
    .refine(date => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'La date de début doit être dans le futur'),

  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)')
    .refine(date => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'La date de fin doit être dans le futur'),

  participants: z
    .number()
    .int('Le nombre de participants doit être un entier')
    .min(1, 'Minimum 1 participant')
    .max(10, 'Maximum 10 participants'),

  specialRequests: z
    .string()
    .max(1000, 'Les demandes spéciales ne peuvent pas dépasser 1000 caractères')
    .optional(),

  recaptchaToken: z.string().min(1, 'Token reCAPTCHA requis'),

  // Données de tracking
  utm_source: z.string().max(100, 'UTM source trop long').optional(),

  utm_medium: z.string().max(100, 'UTM medium trop long').optional(),

  utm_campaign: z.string().max(100, 'UTM campaign trop long').optional(),

  referrer: z.string().max(500, 'Referrer trop long').optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Schéma pour la validation côté serveur
export const checkoutServerSchema = checkoutSchema
  .extend({
    ip: z.string().optional(),
    userAgent: z.string().optional(),
    timestamp: z.date().optional(),
    // Validation supplémentaire des dates
    startDate: z.string().refine(date => {
      const selectedDate = new Date(date);
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 2); // Max 2 ans dans le futur
      return selectedDate <= maxDate;
    }, 'La date de début ne peut pas être plus de 2 ans dans le futur'),
    // endDate: z.string() // plus de validation ici
  })
  .superRefine((data, ctx) => {
    const { startDate, endDate } = data;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 1 || diffDays > 30) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La durée du séjour doit être entre 1 et 30 jours',
          path: ['endDate'],
        });
      }
    }
  });

export type CheckoutServerData = z.infer<typeof checkoutServerSchema>;
