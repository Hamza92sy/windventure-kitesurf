import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { packageUtils } from '@/data/packages-optimized';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session ID' },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product']
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Extract booking information from metadata
    const packageId = session.metadata?.packageId;
    const customerData = session.metadata?.customerData ? 
      JSON.parse(session.metadata.customerData) : {};

    // Get package details
    const packageInfo = packageUtils.findById(packageId || '');

    return NextResponse.json({
      sessionId: session.id,
      paymentStatus: session.payment_status,
      amountPaid: (session.amount_total || 0) / 100, // Convert from cents
      currency: session.currency,
      packageId,
      packageName: packageInfo?.name || 'Unknown Package',
      participants: parseInt(session.metadata?.participants || '1'),
      customer: {
        email: session.customer_email,
        firstName: session.metadata?.firstName,
        lastName: session.metadata?.lastName,
        phone: session.metadata?.phone,
      },
      preferredDate: session.metadata?.preferredDate,
      specialRequests: session.metadata?.specialRequests,
      createdAt: new Date(session.created * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify session' },
      { status: 500 }
    );
  }
}