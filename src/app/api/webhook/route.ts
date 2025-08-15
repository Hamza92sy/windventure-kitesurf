import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { updateBookingStatus } from '../../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('⚠️  Webhook signature verification failed.', err.message);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  console.log(`🎯 Webhook received: ${event.type}`);

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log('✅ Payment succeeded:', paymentIntent.id);

      if (paymentIntent.metadata?.booking_id) {
        await updateBookingStatus(paymentIntent.metadata.booking_id, 'paid', {
          payment_intent_id: paymentIntent.id,
        });
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const failedPayment = event.data.object;
      console.log('❌ Payment failed:', failedPayment.id);

      if (failedPayment.metadata?.booking_id) {
        await updateBookingStatus(
          failedPayment.metadata.booking_id,
          'cancelled'
        );
      }
      break;
    }

    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log('🎉 Checkout session completed:', session.id);

      if (session.metadata?.booking_id) {
        await updateBookingStatus(session.metadata.booking_id, 'confirmed', {
          session_id: session.id,
        });
      }
      break;
    }

    default:
      console.log(`🤷‍♂️ Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
