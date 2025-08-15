import { NextRequest, NextResponse } from 'next/server';
import { queueClient } from '@/lib/queue-client';

// 🎯 SCÉNARIO C : NOTIFIER
// Déclenché par Supabase webhook quand un job passe à 'done' ou 'dead_letter'
// Envoie les notifications (email, Notion, Slack, etc.)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('🔔 Notifier triggered:', body);

    // Validation du webhook Supabase
    if (!body.type || !body.record) {
      return NextResponse.json(
        { error: 'Invalid Supabase webhook payload' },
        { status: 400 }
      );
    }

    const { type, record, old_record } = body;
    
    // Vérifier que c'est un changement de statut vers done/dead_letter
    if (type !== 'UPDATE' || !isStatusChangeToNotify(record, old_record)) {
      return NextResponse.json({
        success: true,
        message: 'No notification needed',
        skipped: true
      });
    }

    const job = record;
    const notifications = [];

    // Déterminer les notifications à envoyer selon le statut final
    if (job.status === 'done') {
      notifications.push(await sendSuccessNotifications(job));
    } else if (job.status === 'dead_letter') {
      notifications.push(await sendFailureNotifications(job));
    }

    // Mise à jour optionnelle dans Notion
    if (shouldUpdateNotionStatus(job)) {
      notifications.push(await updateNotionStatus(job));
    }

    // Log des notifications envoyées
    await queueClient.logStage(
      job.id,
      'notification',
      'success',
      {
        notifications_sent: notifications.length,
        notification_types: notifications.map(n => n.type)
      }
    );

    console.log(`✅ Sent ${notifications.length} notifications for job ${job.id}`);

    return NextResponse.json({
      success: true,
      job_id: job.id,
      job_status: job.status,
      notifications_sent: notifications.length,
      notifications: notifications
    });

  } catch (error) {
    console.error('❌ Notifier error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown notification error'
    }, { status: 500 });
  }
}

// Vérifier si le changement de statut nécessite une notification
function isStatusChangeToNotify(newRecord: any, oldRecord: any): boolean {
  if (!oldRecord || newRecord.status === oldRecord.status) {
    return false;
  }
  
  const notifiableStatuses = ['done', 'dead_letter'];
  return notifiableStatuses.includes(newRecord.status);
}

// Envoyer les notifications de succès
async function sendSuccessNotifications(job: any) {
  const notifications = [];

  try {
    // Email de confirmation selon le type de job
    switch (job.job_type) {
      case 'booking_sync':
        const emailResult = await sendBookingSuccessEmail(job);
        notifications.push({ type: 'email', status: 'sent', details: emailResult });
        break;

      case 'stripe_setup':
        const stripeResult = await sendStripeSetupEmail(job);
        notifications.push({ type: 'email', status: 'sent', details: stripeResult });
        break;

      case 'email_investor':
        notifications.push({ type: 'email', status: 'completed', message: 'Email already sent by job' });
        break;
    }

    // Notification Slack générique (optionnel)
    if (process.env.SLACK_WEBHOOK_URL) {
      const slackResult = await sendSlackNotification({
        color: 'good',
        title: `✅ Job ${job.job_type} completed`,
        message: `Job ${job.id} completed successfully in ${getJobDuration(job)}`,
        fields: [
          { title: 'Job Type', value: job.job_type },
          { title: 'Duration', value: getJobDuration(job) },
          { title: 'Attempts', value: job.attempts || 1 }
        ]
      });
      notifications.push({ type: 'slack', status: 'sent', details: slackResult });
    }

  } catch (error) {
    console.error('Error sending success notifications:', error);
    notifications.push({ 
      type: 'error', 
      status: 'failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }

  return notifications;
}

// Envoyer les notifications d'échec
async function sendFailureNotifications(job: any) {
  const notifications = [];

  try {
    // Email d'alerte aux admins
    if (process.env.ADMIN_EMAIL) {
      const adminEmailResult = await sendAdminAlert({
        subject: `🚨 Job Failed: ${job.job_type}`,
        jobId: job.id,
        jobType: job.job_type,
        error: job.result?.error || 'Unknown error',
        attempts: job.attempts || 0,
        payload: job.payload
      });
      notifications.push({ type: 'admin_email', status: 'sent', details: adminEmailResult });
    }

    // Notification Slack d'alerte
    if (process.env.SLACK_WEBHOOK_URL) {
      const slackResult = await sendSlackNotification({
        color: 'danger',
        title: `🚨 Job ${job.job_type} failed`,
        message: `Job ${job.id} failed after ${job.attempts} attempts`,
        fields: [
          { title: 'Job Type', value: job.job_type },
          { title: 'Error', value: job.result?.error || 'Unknown error' },
          { title: 'Attempts', value: job.attempts || 0 },
          { title: 'Duration', value: getJobDuration(job) }
        ]
      });
      notifications.push({ type: 'slack_alert', status: 'sent', details: slackResult });
    }

    // Notion update avec statut d'erreur
    if (job.job_type === 'notion_update' || shouldUpdateNotionStatus(job)) {
      const notionResult = await updateNotionStatus(job, 'error');
      notifications.push({ type: 'notion_update', status: 'sent', details: notionResult });
    }

  } catch (error) {
    console.error('Error sending failure notifications:', error);
    notifications.push({ 
      type: 'error', 
      status: 'failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }

  return notifications;
}

// Calculer la durée d'exécution du job
function getJobDuration(job: any): string {
  if (!job.created_at || !job.finished_at) {
    return 'unknown';
  }
  
  const start = new Date(job.created_at).getTime();
  const end = new Date(job.finished_at).getTime();
  const durationMs = end - start;
  
  if (durationMs < 1000) {
    return `${durationMs}ms`;
  } else if (durationMs < 60000) {
    return `${Math.round(durationMs / 1000)}s`;
  } else {
    return `${Math.round(durationMs / 60000)}m`;
  }
}

// Vérifier si on doit mettre à jour Notion
function shouldUpdateNotionStatus(job: any): boolean {
  return job.payload?.update_notion === true || 
         job.job_type === 'booking_sync' ||
         job.payload?.source === 'notion';
}

// Mock functions - remplace par tes vraies implémentations
async function sendBookingSuccessEmail(job: any) {
  console.log('📧 Sending booking success email for job:', job.id);
  // TODO: Implémenter avec ton service email (Resend, SendGrid, etc.)
  return { email_sent: true, recipient: job.payload?.email };
}

async function sendStripeSetupEmail(job: any) {
  console.log('📧 Sending Stripe setup email for job:', job.id);
  // TODO: Implémenter email de confirmation Stripe
  return { email_sent: true, customer_id: job.payload?.customer_id };
}

async function sendAdminAlert(alertData: any) {
  console.log('🚨 Sending admin alert:', alertData);
  // TODO: Implémenter email admin avec ton service
  return { alert_sent: true, subject: alertData.subject };
}

async function sendSlackNotification(slackData: any) {
  console.log('💬 Sending Slack notification:', slackData.title);
  
  if (!process.env.SLACK_WEBHOOK_URL) {
    return { skipped: true, reason: 'No Slack webhook configured' };
  }

  try {
    const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attachments: [slackData]
      })
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status}`);
    }

    return { sent: true, webhook_response: response.status };

  } catch (error) {
    console.error('Slack notification error:', error);
    return { sent: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function updateNotionStatus(job: any, status: string = 'completed') {
  console.log('📝 Updating Notion status for job:', job.id);
  
  // TODO: Implémenter mise à jour Notion via leur API
  // Utiliser tes scripts existants dans /scripts/notion/
  
  return { 
    notion_updated: true, 
    page_id: job.payload?.page_id,
    new_status: status
  };
}