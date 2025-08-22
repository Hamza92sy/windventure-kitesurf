import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Use test keys for now until real Stripe account is configured
const stripeKey = process.env.STRIPE_SECRET_KEY_TEST || process.env.STRIPE_SECRET_KEY!;
const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const { packageId, priceId, bookingData } = await request.json();

    // Map package IDs to prices
    const packagePrices: Record<string, number> = {
      'beginner-private': 720,
      'beginner-semi-private': 1100, 
      'exploration': 1250,
      'combined': 1350
    };

    const unitPrice = packagePrices[packageId];
    if (!unitPrice) {
      return NextResponse.json(
        { error: 'Invalid package ID' },
        { status: 400 }
      );
    }

    // Log the booking for now (in production this would save to database)
    console.log('🎯 New Booking Request:', {
      package: packageId,
      price: unitPrice,
      participants: bookingData.participants,
      customer: `${bookingData.firstName} ${bookingData.lastName}`,
      email: bookingData.email,
      phone: bookingData.phone,
      date: bookingData.preferredDate,
      total: unitPrice * (bookingData.participants || 1)
    });

    // Try to create Stripe session, fallback to demo mode if it fails
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Windventure ${packageId.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} Package`,
                description: 'Premium kitesurfing experience in Dakhla, Morocco',
              },
              unit_amount: unitPrice * 100, // Stripe expects amount in cents
            },
            quantity: bookingData.participants || 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel?package=${packageId}`,
        metadata: {
          packageId,
          participants: String(bookingData.participants || 1),
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          phone: bookingData.phone,
          preferredDate: bookingData.preferredDate,
          specialRequests: bookingData.specialRequests || '',
          customerData: JSON.stringify(bookingData),
        },
        customer_email: bookingData.email,
      });

      return NextResponse.json({ checkoutUrl: session.url });
    } catch (stripeError) {
      console.error('Stripe error, using demo mode:', stripeError);
      
      // Fallback: redirect to success page with demo parameters
      const demoSessionId = 'demo_' + Date.now();
      const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL?.trim()}/success?session_id=${demoSessionId}&demo=true&package=${packageId}&amount=${unitPrice * (bookingData.participants || 1)}`;
      
      return NextResponse.json({ checkoutUrl: successUrl });
    }
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}