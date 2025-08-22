import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { packagesOptimized, calculatePackageTotal } from '@/data/packages-optimized';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * 🚀 API CHECKOUT OPTIMISÉE - PACKAGES 4 PERSONNES
 * Gère les réservations avec le nouveau pricing par personne
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packageId, priceId, participants, bookingData } = body;

    // Validation package existe
    const selectedPackage = packagesOptimized.find(pkg => pkg.id === packageId);
    if (!selectedPackage) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    // Validation nombre participants
    if (participants > (selectedPackage.maxParticipants || 1)) {
      return NextResponse.json(
        { error: `Maximum ${selectedPackage.maxParticipants} participants for ${selectedPackage.name}` },
        { status: 400 }
      );
    }

    // Calcul prix total
    const totalPrice = calculatePackageTotal(packageId, participants);
    
    // Configuration session Stripe
    const lineItem = {
      price_data: {
        currency: 'eur',
        product_data: {
          name: selectedPackage.name,
          description: `${selectedPackage.shortDescription} - ${participants} participant(s)`,
          images: selectedPackage.image ? [`${process.env.NEXT_PUBLIC_BASE_URL}${selectedPackage.image}`] : [],
          metadata: {
            package_id: packageId,
            participants: participants.toString(),
            max_participants: (selectedPackage.maxParticipants || 1).toString(),
            duration: selectedPackage.duration,
            is_per_person: (selectedPackage.id !== 'beginner-private').toString()
          }
        },
        unit_amount: selectedPackage.id === 'beginner-private' 
          ? selectedPackage.price * 100  // Prix fixe beginner private
          : selectedPackage.price * 100, // Prix par personne
      },
      quantity: selectedPackage.id === 'beginner-private' ? 1 : participants,
    };

    // Création session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [lineItem],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking-success?session_id={CHECKOUT_SESSION_ID}&package=${packageId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/book?package=${packageId}&cancelled=true`,
      customer_email: bookingData.email,
      metadata: {
        package_id: packageId,
        participants: participants.toString(),
        customer_first_name: bookingData.firstName,
        customer_last_name: bookingData.lastName,
        customer_phone: bookingData.phone,
        preferred_date: bookingData.preferredDate,
        special_requests: bookingData.specialRequests || '',
        total_price_eur: (totalPrice).toString(),
        booking_system: 'optimized_4persons',
        created_at: new Date().toISOString()
      },
      // Configuration avancée
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      custom_fields: [
        {
          key: 'preferred_start_date',
          label: { type: 'custom', custom: 'Preferred Start Date' },
          type: 'text',
          optional: false,
        },
        {
          key: 'experience_level',
          label: { type: 'custom', custom: 'Kitesurfing Experience Level' },
          type: 'dropdown',
          dropdown: {
            options: [
              { label: 'Complete Beginner', value: 'beginner' },
              { label: 'Some Experience', value: 'intermediate' },
              { label: 'Advanced', value: 'advanced' }
            ]
          },
          optional: true,
        }
      ],
      // Configuratoin locale
      locale: 'fr',
      
      // Taxes et frais (si applicable)
      automatic_tax: {
        enabled: false, // Pas de TVA au Maroc pour tourisme
      }
    });

    // Logging pour monitoring
    console.log(`💳 Checkout créé: ${session.id}`, {
      package: selectedPackage.name,
      participants,
      totalPrice: `${totalPrice}€`,
      customer: `${bookingData.firstName} ${bookingData.lastName}`,
      email: bookingData.email
    });

    return NextResponse.json({ 
      checkoutUrl: session.url,
      sessionId: session.id,
      totalPrice,
      package: selectedPackage.name,
      participants
    });

  } catch (error: any) {
    console.error('❌ Erreur checkout optimisé:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

/**
 * 🔍 GET - Récupération info package pour affichage checkout
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('packageId');
    const participants = parseInt(searchParams.get('participants') || '1');

    if (!packageId) {
      return NextResponse.json({ error: 'Package ID required' }, { status: 400 });
    }

    const selectedPackage = packagesOptimized.find(pkg => pkg.id === packageId);
    if (!selectedPackage) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    const totalPrice = calculatePackageTotal(packageId, participants);

    return NextResponse.json({
      package: selectedPackage,
      participants,
      totalPrice,
      pricePerPerson: selectedPackage.price,
      maxParticipants: selectedPackage.maxParticipants
    });

  } catch (error: any) {
    console.error('❌ Erreur GET checkout info:', error);
    return NextResponse.json({ error: 'Failed to get package info' }, { status: 500 });
  }
}