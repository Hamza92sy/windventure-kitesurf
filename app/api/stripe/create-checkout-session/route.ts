// 🚀 API ROUTE STRIPE CHECKOUT - WINDVENTURE PACKAGES 4 PERSONNES
// app/api/stripe/create-checkout-session/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { optimizedPackages, packageUtils } from '../../../../src/data/packages-optimized';

// Initialiser Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

interface CheckoutRequestBody {
  packageId: string;
  packageName: string;
  stripePriceId: string;
  quantity: number;
  totalPrice: number;
  pricePerPerson: number;
  personsCount: number;
  marginNet: number;
  startDate: string;
  endDate: string;
  duration: number;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  metadata: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json();
    
    // Validation des données
    const validationResult = validateCheckoutData(body);
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: 400 }
      );
    }

    // Trouver le package
    const currentPackage = optimizedPackages.find(pkg => pkg.id === body.packageId);
    if (!currentPackage) {
      return NextResponse.json(
        { error: 'Package non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier cohérence prix
    const expectedPrice = packageUtils.calculateTotalPrice(body.packageId, body.personsCount);
    if (Math.abs(expectedPrice - body.totalPrice) > 1) { // Tolérance 1€
      return NextResponse.json(
        { error: `Prix incohérent. Attendu: ${expectedPrice}€, reçu: ${body.totalPrice}€` },
        { status: 400 }
      );
    }

    // Créer session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      
      // Configuration ligne de commande
      line_items: [
        {
          price: body.stripePriceId,
          quantity: body.quantity,
          adjustable_quantity: {
            enabled: false, // Pas de modification manuelle
          },
        },
      ],

      // URLs de redirection
      success_url: `${getBaseUrl(request)}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getBaseUrl(request)}/booking/cancel`,

      // Informations client
      customer_email: body.customerInfo.email,
      
      // Métadonnées complètes pour webhooks
      metadata: {
        // Package info
        package_id: body.packageId,
        package_name: body.packageName,
        package_category: currentPackage.category,
        
        // Business metrics
        persons_count: body.personsCount.toString(),
        max_persons: currentPackage.maxPersons.toString(),
        price_per_person: body.pricePerPerson.toString(),
        total_price: body.totalPrice.toString(),
        margin_net: body.marginNet.toString(),
        
        // Dates
        start_date: body.startDate,
        end_date: body.endDate,
        duration_days: body.duration.toString(),
        
        // Client
        customer_first_name: body.customerInfo.firstName,
        customer_last_name: body.customerInfo.lastName,
        customer_phone: body.customerInfo.phone,
        customer_email: body.customerInfo.email,
        
        // Système
        business_model: 'windventure_4_persons_optimized',
        created_at: new Date().toISOString(),
        
        // Pour intégration Make.com/Notion
        webhook_trigger: 'checkout_completed',
        notion_sync_required: 'true',
        email_confirmation_required: 'true',
        
        // IDs pour tracking
        ...body.metadata
      },

      // Configuration session
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'CA', 'US', 'DE', 'ES', 'IT', 'PT', 'NL'],
      },

      // Configuration paiement
      payment_intent_data: {
        metadata: {
          package_id: body.packageId,
          persons_count: body.personsCount.toString(),
          total_price: body.totalPrice.toString(),
        },
      },

      // Informations additionnelles
      custom_text: {
        submit: {
          message: 'Votre réservation WindVenture sera confirmée immédiatement après paiement.',
        },
      },

      // Consentements
      consent_collection: {
        terms_of_service: 'required',
      },

      // Configuration locale
      locale: 'fr',
      
      // Expires après 30 minutes
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60),
    });

    // Log pour monitoring (dev uniquement)
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Session Stripe créée:', {
        sessionId: session.id,
        packageId: body.packageId,
        personsCount: body.personsCount,
        totalPrice: body.totalPrice,
        marginNet: body.marginNet,
      });
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });

  } catch (error) {
    console.error('❌ Erreur création session Stripe:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur interne serveur',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}

// Validation des données de checkout
function validateCheckoutData(body: CheckoutRequestBody): { isValid: boolean; error?: string } {
  // Validation package
  if (!body.packageId || !body.stripePriceId) {
    return { isValid: false, error: 'Données package manquantes' };
  }

  // Validation quantité
  if (!Number.isInteger(body.quantity) || body.quantity < 1) {
    return { isValid: false, error: 'Quantité invalide' };
  }

  // Validation prix
  if (!Number.isFinite(body.totalPrice) || body.totalPrice <= 0) {
    return { isValid: false, error: 'Prix invalide' };
  }

  // Validation nombre de personnes
  if (!Number.isInteger(body.personsCount) || body.personsCount < 1 || body.personsCount > 4) {
    return { isValid: false, error: 'Nombre de personnes invalide (1-4)' };
  }

  // Validation dates
  const startDate = new Date(body.startDate);
  const endDate = new Date(body.endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (startDate < today) {
    return { isValid: false, error: 'Date de début dans le passé' };
  }

  if (endDate <= startDate) {
    return { isValid: false, error: 'Date de fin doit être après date de début' };
  }

  // Validation client
  const { customerInfo } = body;
  if (!customerInfo.email || !customerInfo.email.includes('@')) {
    return { isValid: false, error: 'Email invalide' };
  }

  if (!customerInfo.firstName?.trim() || !customerInfo.lastName?.trim()) {
    return { isValid: false, error: 'Nom et prénom requis' };
  }

  if (!customerInfo.phone?.trim()) {
    return { isValid: false, error: 'Téléphone requis' };
  }

  return { isValid: true };
}

// Obtenir URL de base selon environnement
function getBaseUrl(request: NextRequest): string {
  if (process.env.NODE_ENV === 'production') {
    return 'https://windventure.fr';
  }
  
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

// Route GET pour vérification santé
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'stripe-checkout-4-persons',
    timestamp: new Date().toISOString(),
    packages_available: optimizedPackages.length,
  });
}