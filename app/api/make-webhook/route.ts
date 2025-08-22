import { NextRequest, NextResponse } from 'next/server';

const MAKE_WEBHOOK_CUSTOM = process.env.MAKE_WEBHOOK_CUSTOM || '';
const MAKE_WEBHOOK_PACKAGES = process.env.MAKE_WEBHOOK_PACKAGES || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formType, ...formData } = body;

    const webhookUrl = formType === 'custom' ? MAKE_WEBHOOK_CUSTOM : MAKE_WEBHOOK_PACKAGES;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Webhook URL not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        timestamp: new Date().toISOString(),
        source: 'windventure.fr'
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook responded with status: ${response.status}`);
    }

    return NextResponse.json({ 
      success: true,
      message: 'Booking request submitted successfully'
    });
  } catch (error) {
    console.error('Error forwarding to Make.com:', error);
    return NextResponse.json(
      { error: 'Failed to process booking request' },
      { status: 500 }
    );
  }
}