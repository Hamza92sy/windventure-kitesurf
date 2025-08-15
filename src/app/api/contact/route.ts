import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const webhookUrl = process.env.N8N_CONTACT_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error('N8N_CONTACT_WEBHOOK_URL is not set');
      return new NextResponse('Internal Server Error', { status: 500 });
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('Failed to send data to n8n', await response.text());
      return new NextResponse('Internal Server Error', { status: 500 });
    }

    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
