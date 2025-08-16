import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return new NextResponse('No stripe-signature header found', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      // Handle completed checkout session
      const checkoutSessionCompleted = event.data.object;
      console.log('Checkout session completed:', checkoutSessionCompleted);
      // TODO: See backlog/stripe_webhook_fulfillment.md for implementation details
      break;
    case 'payment_intent.succeeded':
      // Handle successful payment intent
      const paymentIntentSucceeded = event.data.object;
      console.log('Payment intent succeeded:', paymentIntentSucceeded);
      // TODO: See backlog/stripe_webhook_fulfillment.md for implementation details
      break;
    // ... handle other event types
    default:
      console.warn(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return new NextResponse('Received', { status: 200 });
}
