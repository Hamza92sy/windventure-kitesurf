// 🔄 WEBHOOK STRIPE + INTÉGRATION MAKE.COM/NOTION
// app/api/webhooks/stripe/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

// Initialiser Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

interface BookingData {
  // Stripe session
  sessionId: string;
  paymentIntentId: string;
  amountTotal: number;
  currency: string;
  
  // Package details
  packageId: string;
  packageName: string;
  packageCategory: string;
  
  // Business metrics
  personsCount: number;
  maxPersons: number;
  pricePerPerson: number;
  totalPrice: number;
  marginNet: number;
  
  // Dates
  startDate: string;
  endDate: string;
  durationDays: number;
  
  // Customer
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  
  // Système
  businessModel: string;
  createdAt: string;
  paidAt: string;
  status: 'paid' | 'pending' | 'failed';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature')!;
    
    // Vérifier signature webhook
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (error) {
      console.error('❌ Signature webhook invalide:', error);
      return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
    }

    console.log('📨 Webhook reçu:', event.type, event.id);

    // Traiter selon type d'événement
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
        
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
        
      default:
        console.log(`ℹ️ Événement non traité: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('💥 Erreur webhook:', error);
    return NextResponse.json(
      { error: 'Erreur interne' },
      { status: 500 }
    );
  }
}

// Traiter checkout complété
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('✅ Checkout complété:', session.id);
    
    // Extraire métadonnées
    const bookingData = extractBookingData(session);
    
    // Envoyer à Make.com pour Notion
    await sendToMakecom(bookingData);
    
    // Envoyer email confirmation (via Make.com aussi)
    await triggerConfirmationEmail(bookingData);
    
    console.log('🎉 Réservation traitée avec succès:', bookingData.sessionId);
    
  } catch (error) {
    console.error('❌ Erreur traitement checkout:', error);
    // Ne pas faire échouer le webhook, juste logger
  }
}

// Traiter paiement réussi
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('💰 Paiement réussi:', paymentIntent.id);
    // Logging pour analytics
  } catch (error) {
    console.error('❌ Erreur mise à jour paiement:', error);
  }
}

// Traiter échec paiement
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log('❌ Paiement échoué:', paymentIntent.id);
    // Notification équipe si nécessaire
  } catch (error) {
    console.error('❌ Erreur traitement échec:', error);
  }
}

// Extraire données réservation depuis session Stripe
function extractBookingData(session: Stripe.Checkout.Session): BookingData {
  const metadata = session.metadata || {};
  
  return {
    // Stripe
    sessionId: session.id,
    paymentIntentId: session.payment_intent as string,
    amountTotal: session.amount_total || 0,
    currency: session.currency || 'eur',
    
    // Package
    packageId: metadata.package_id || '',
    packageName: metadata.package_name || '',
    packageCategory: metadata.package_category || '',
    
    // Business
    personsCount: parseInt(metadata.persons_count || '1'),
    maxPersons: parseInt(metadata.max_persons || '4'),
    pricePerPerson: parseFloat(metadata.price_per_person || '0'),
    totalPrice: parseFloat(metadata.total_price || '0'),
    marginNet: parseFloat(metadata.margin_net || '0'),
    
    // Dates
    startDate: metadata.start_date || '',
    endDate: metadata.end_date || '',
    durationDays: parseInt(metadata.duration_days || '0'),
    
    // Client
    customerEmail: metadata.customer_email || session.customer_details?.email || '',
    customerFirstName: metadata.customer_first_name || '',
    customerLastName: metadata.customer_last_name || '',
    customerPhone: metadata.customer_phone || '',
    
    // Système
    businessModel: metadata.business_model || 'windventure_4_persons',
    createdAt: metadata.created_at || new Date().toISOString(),
    paidAt: new Date().toISOString(),
    status: 'paid' as const,
  };
}

// Envoyer à Make.com pour synchronisation Notion
async function sendToMakecom(bookingData: BookingData) {
  try {
    const makeWebhookUrl = process.env.MAKECOM_WEBHOOK_URL;
    if (!makeWebhookUrl) {
      console.warn('⚠️ URL webhook Make.com non configurée');
      return;
    }

    // Payload optimisé pour Make.com → Notion avec mapping exact
    const payload = {
      // Champs exacts pour votre configuration Notion existante
      name: `${bookingData.customerFirstName} ${bookingData.customerLastName}`,
      email: bookingData.customerEmail,
      packageTitle: bookingData.packageName,
      arrivalDate: bookingData.startDate,
      departureDate: bookingData.endDate,
      participants: bookingData.personsCount,
      price: bookingData.totalPrice,
      phone: bookingData.customerPhone,
      message: `Réservation confirmée - Session Stripe: ${bookingData.sessionId}`,
      accommodation: 'Hébergement WindVenture inclus',
      specialRequests: 'Réservation via site web - 4 personnes optimisé',
      source: 'Site web WindVenture',
      
      // Métadonnées business pour reporting
      marginNet: bookingData.marginNet,
      packageCategory: bookingData.packageCategory,
      stripeSessionId: bookingData.sessionId,
      paymentStatus: 'paid',
      createdAt: bookingData.paidAt,
    };

    const response = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WindVenture-Webhook-4Persons/1.0',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`✅ Données envoyées vers Make.com pour session: ${bookingData.sessionId}`);
    } else {
      const errorText = await response.text();
      console.error(`❌ Erreur Make.com (${response.status}):`, errorText);
      
      // Retry logic simple
      await retryMakeWebhook(payload, 1);
    }
    
  } catch (error) {
    console.error('❌ Erreur Make.com:', error);
    // Ne pas faire échouer le webhook principal
  }
}

// Retry logic pour webhook Make.com
async function retryMakeWebhook(data: any, attempt: number, maxAttempts = 3) {
  if (attempt > maxAttempts) {
    console.error(`❌ Échec définitif envoi Make.com après ${maxAttempts} tentatives`);
    return;
  }

  try {
    await new Promise(resolve => setTimeout(resolve, attempt * 1000)); // Backoff
    
    const response = await fetch(process.env.MAKECOM_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log(`✅ Retry ${attempt} réussi pour Make.com`);
    } else {
      await retryMakeWebhook(data, attempt + 1, maxAttempts);
    }
  } catch (error) {
    console.error(`❌ Retry ${attempt} échoué:`, error);
    await retryMakeWebhook(data, attempt + 1, maxAttempts);
  }
}

// Déclencher email de confirmation
async function triggerConfirmationEmail(bookingData: BookingData) {
  try {
    const emailWebhookUrl = process.env.MAKECOM_EMAIL_WEBHOOK_URL;
    if (!emailWebhookUrl) {
      console.log('ℹ️ Email automatique géré par Make.com principal');
      return;
    }

    const emailPayload = {
      trigger: 'send_booking_confirmation_4_persons',
      booking_id: bookingData.sessionId,
      
      customer: {
        email: bookingData.customerEmail,
        first_name: bookingData.customerFirstName,
        last_name: bookingData.customerLastName,
      },
      
      booking_details: {
        package_name: bookingData.packageName,
        persons_count: bookingData.personsCount,
        start_date: bookingData.startDate,
        end_date: bookingData.endDate,
        total_price: bookingData.totalPrice,
        confirmation_code: generateConfirmationCode(bookingData.sessionId),
      },
      
      template: 'booking_confirmation_4_persons_optimized',
    };

    await fetch(emailWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailPayload),
    });

    console.log('📧 Email confirmation déclenché');
    
  } catch (error) {
    console.error('❌ Erreur email:', error);
  }
}

// Utilitaires
function generateConfirmationCode(sessionId: string): string {
  return `WV4P-${sessionId.slice(-8).toUpperCase()}`;
}