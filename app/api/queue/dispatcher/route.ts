import { NextRequest, NextResponse } from 'next/server';
import { queueClient, JobFactory } from '@/lib/queue-client';

// 🎯 SCÉNARIO A : DISPATCHER
// Point d'entrée pour tous les jobs - remplace le webhook monolithe
// Reçoit les missions et les place en queue avec priorité

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validation basique
    if (!body.type || !body.data) {
      return NextResponse.json(
        { error: 'Missing type or data in request body' },
        { status: 400 }
      );
    }

    const { type, data, priority = 0, source = 'api' } = body;
    
    console.log(`🚀 Dispatching job of type: ${type}`);

    let jobPayload;
    let jobType;

    // Factory pattern pour créer le bon payload selon le type
    switch (type) {
      case 'booking_created':
      case 'booking_updated':
        jobType = 'booking_sync';
        jobPayload = JobFactory.createBookingSync(data);
        break;

      case 'stripe_customer_setup':
        jobType = 'stripe_setup';
        jobPayload = JobFactory.createStripeSetup(data.customer_id, data);
        break;

      case 'send_investor_email':
        jobType = 'email_investor';
        jobPayload = JobFactory.createEmailInvestor(data.recipient, data);
        break;

      case 'notion_status_update':
        jobType = 'notion_update';
        jobPayload = JobFactory.createNotionUpdate(data.page_id, data);
        break;

      case 'webhook_delivery':
        jobType = 'webhook_delivery';
        jobPayload = {
          webhook_url: data.url,
          webhook_data: data.payload,
          retry_count: data.retry_count || 3,
          correlation_id: `webhook_${data.url}`,
          timestamp: new Date().toISOString()
        };
        break;

      case 'file_processing':
        jobType = 'file_processing';
        jobPayload = {
          file_path: data.file_path,
          processing_type: data.type,
          options: data.options,
          correlation_id: `file_${data.file_path}`,
          timestamp: new Date().toISOString()
        };
        break;

      default:
        return NextResponse.json(
          { error: `Unknown job type: ${type}` },
          { status: 400 }
        );
    }

    // Enqueue avec métadonnées
    jobPayload.source = source;
    jobPayload.original_type = type;
    
    const jobId = await queueClient.enqueue(jobType, jobPayload, {
      priority,
      // Clé d'idempotence personnalisée si fournie
      idempotencyKey: body.idempotency_key,
      maxAttempts: body.max_attempts || 3
    });

    console.log(`✅ Job ${jobId} queued successfully`);

    return NextResponse.json({
      success: true,
      job_id: jobId,
      job_type: jobType,
      status: 'queued',
      estimated_processing_time: getEstimatedProcessingTime(jobType)
    });

  } catch (error) {
    console.error('Dispatcher error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to dispatch job',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET pour vérifier le statut d'un job
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('job_id');
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'job_id parameter required' },
        { status: 400 }
      );
    }

    // Récupérer le statut du job
    const stats = await queueClient.getQueueStats();
    
    return NextResponse.json({
      job_id: jobId,
      queue_stats: stats
    });

  } catch (error) {
    console.error('Status check error:', error);
    
    return NextResponse.json(
      { error: 'Failed to check job status' },
      { status: 500 }
    );
  }
}

// Estimation du temps de traitement selon le type de job
function getEstimatedProcessingTime(jobType: string): string {
  const estimates = {
    booking_sync: '30-60 seconds',
    stripe_setup: '45-90 seconds', 
    email_investor: '15-30 seconds',
    notion_update: '10-20 seconds',
    webhook_delivery: '5-15 seconds',
    file_processing: '1-5 minutes'
  };
  
  return estimates[jobType as keyof typeof estimates] || '30-120 seconds';
}