import { NextRequest, NextResponse } from 'next/server';
import { createBooking } from '../../../lib/supabase';
import { sendEmail } from '../../../lib/email';

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json();

    // Create booking in Supabase
    const booking = await createBooking(bookingData);

    // Call n8n webhook
    const webhookUrl = process.env.N8N_BOOKING_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
      });
    }

    // Send confirmation email
    await sendEmail({
      to: booking.email,
      subject: 'Your Windventure Booking Confirmation',
      html: `<h1>Booking Confirmed!</h1><p>Thank you for booking with Windventure. Your booking details are as follows:</p><p>Package: ${booking.package_title}</p><p>Date: ${booking.date}</p><p>Participants: ${booking.participants}</p>`,
    });

    return NextResponse.json({ booking, success: true });
  } catch (error: unknown) {
    console.error('Error creating booking:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create booking', details: errorMessage },
      { status: 500 }
    );
  }
}
