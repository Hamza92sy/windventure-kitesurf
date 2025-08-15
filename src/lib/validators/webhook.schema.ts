import { z } from 'zod';

// Schéma pour les événements Stripe
export const stripeEventSchema = z.object({
  id: z.string().min(1, "ID d'événement requis"),
  object: z.literal('event'),
  api_version: z.string().optional(),
  created: z.number().int().positive(),
  data: z.object({
    object: z.record(z.string(), z.any()), // L'objet peut varier selon le type d'événement
  }),
  livemode: z.boolean(),
  pending_webhooks: z.number().int().min(0),
  request: z
    .object({
      id: z.string().optional(),
      idempotency_key: z.string().optional(),
    })
    .optional(),
  type: z.string().min(1, "Type d'événement requis"),
});

// Schéma pour les sessions de checkout Stripe
export const stripeCheckoutSessionSchema = z.object({
  id: z.string().min(1, 'ID de session requis'),
  object: z.literal('checkout.session'),
  amount_total: z.number().int().positive().optional(),
  currency: z.string().length(3),
  customer: z.string().optional(),
  customer_details: z
    .object({
      email: z.string().email().optional(),
      name: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  mode: z.enum(['payment', 'subscription', 'setup']),
  payment_intent: z.string().optional(),
  payment_status: z.enum(['paid', 'unpaid', 'no_payment_required']),
  status: z.enum(['open', 'complete', 'expired']),
  success_url: z.string().url(),
  cancel_url: z.string().url(),
  created: z.number().int().positive(),
  expires_at: z.number().int().positive().optional(),
});

// Schéma pour les paiements Stripe
export const stripePaymentIntentSchema = z.object({
  id: z.string().min(1, 'ID de paiement requis'),
  object: z.literal('payment_intent'),
  amount: z.number().int().positive(),
  currency: z.string().length(3),
  customer: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  status: z.enum([
    'requires_payment_method',
    'requires_confirmation',
    'requires_action',
    'processing',
    'requires_capture',
    'canceled',
    'succeeded',
  ]),
  created: z.number().int().positive(),
});

// Schéma pour les webhooks Stripe
export const webhookSchema = z.object({
  // Headers de sécurité
  'stripe-signature': z.string().min(1, 'Signature Stripe requise'),

  // Corps de la requête
  body: z.string().min(1, 'Corps de la requête requis'),

  // Données de requête
  method: z.literal('POST'),
  url: z.string().url(),

  // Données de sécurité
  ip: z.string().optional(),
  userAgent: z.string().optional(),
  timestamp: z.date().optional(),
});

export type StripeEvent = z.infer<typeof stripeEventSchema>;
export type StripeCheckoutSession = z.infer<typeof stripeCheckoutSessionSchema>;
export type StripePaymentIntent = z.infer<typeof stripePaymentIntentSchema>;
export type WebhookData = z.infer<typeof webhookSchema>;

// Types d'événements Stripe supportés
export const SUPPORTED_STRIPE_EVENTS = [
  'checkout.session.completed',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
] as const;

export type SupportedStripeEvent = (typeof SUPPORTED_STRIPE_EVENTS)[number];

// Validation des types d'événements
export const validateStripeEventType = (
  eventType: string
): eventType is SupportedStripeEvent => {
  return SUPPORTED_STRIPE_EVENTS.includes(eventType as SupportedStripeEvent);
};
