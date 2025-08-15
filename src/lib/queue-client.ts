import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role pour les opérations admin
);

// Types pour le système de queue
export interface QueueJob {
  id?: string;
  job_type: JobType;
  status: JobStatus;
  priority?: number;
  payload: Record<string, any>;
  result?: Record<string, any>;
  idempotency_key: string;
  attempts?: number;
  max_attempts?: number;
  next_run?: string;
  locked_by?: string;
  locked_at?: string;
  workflow_version?: string;
  created_at?: string;
  updated_at?: string;
  finished_at?: string;
}

export type JobType = 
  | 'booking_sync'
  | 'stripe_setup' 
  | 'email_investor'
  | 'notion_update'
  | 'payment_processing'
  | 'webhook_delivery'
  | 'data_validation'
  | 'file_processing';

export type JobStatus = 
  | 'queued' 
  | 'processing' 
  | 'done' 
  | 'retry_scheduled' 
  | 'dead_letter';

export interface JobPayload {
  // Payload générique - sera typé selon job_type
  [key: string]: any;
  // Metadata communes
  source?: string;
  correlation_id?: string;
  user_id?: string;
  timestamp?: string;
}

// Client principal pour la queue
export class QueueClient {
  private workerId: string;

  constructor(workerId?: string) {
    this.workerId = workerId || `worker_${process.env.HOSTNAME || 'local'}_${Date.now()}`;
  }

  // Enqueue un nouveau job
  async enqueue(
    jobType: JobType,
    payload: JobPayload,
    options: {
      priority?: number;
      maxAttempts?: number;
      idempotencyKey?: string;
      workflowVersion?: string;
    } = {}
  ): Promise<string> {
    const idempotencyKey = options.idempotencyKey || this.generateIdempotencyKey(payload);
    
    const jobData: Partial<QueueJob> = {
      job_type: jobType,
      status: 'queued',
      priority: options.priority || 0,
      payload,
      idempotency_key: idempotencyKey,
      max_attempts: options.maxAttempts || 3,
      workflow_version: options.workflowVersion || 'v1.0',
    };

    const { data, error } = await supabase
      .from('queue_jobs')
      .upsert(jobData, { onConflict: 'idempotency_key' })
      .select('id')
      .single();

    if (error) {
      throw new Error(`Failed to enqueue job: ${error.message}`);
    }

    return data.id;
  }

  // Récupérer le prochain job à traiter
  async getNextJob(): Promise<QueueJob | null> {
    const { data, error } = await supabase
      .rpc('get_next_job', { worker_id: this.workerId });

    if (error) {
      throw new Error(`Failed to get next job: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return null;
    }

    return {
      id: data[0].job_id,
      job_type: data[0].job_type,
      payload: data[0].payload,
      attempts: data[0].attempts,
      workflow_version: data[0].workflow_version,
      status: 'processing'
    };
  }

  // Marquer un job comme terminé avec succès
  async completeJob(jobId: string, result?: Record<string, any>): Promise<void> {
    const { error } = await supabase
      .rpc('complete_job', { 
        job_id: jobId, 
        job_result: result || null 
      });

    if (error) {
      throw new Error(`Failed to complete job: ${error.message}`);
    }
  }

  // Marquer un job en erreur
  async failJob(
    jobId: string, 
    errorMessage: string, 
    retryDelaySeconds?: number
  ): Promise<void> {
    const { error } = await supabase
      .rpc('fail_job', { 
        job_id: jobId, 
        error_message: errorMessage,
        retry_delay_seconds: retryDelaySeconds || null
      });

    if (error) {
      throw new Error(`Failed to fail job: ${error.message}`);
    }
  }

  // Logger l'audit trail d'un stage
  async logStage(
    jobId: string,
    stage: string,
    status: 'started' | 'success' | 'error',
    metadata?: Record<string, any>,
    latencyMs?: number,
    errorCode?: string,
    errorMessage?: string
  ): Promise<void> {
    const { error } = await supabase
      .from('job_audit_logs')
      .insert({
        job_id: jobId,
        stage,
        status,
        latency_ms: latencyMs || null,
        error_code: errorCode || null,
        error_message: errorMessage || null,
        metadata: metadata || null
      });

    if (error) {
      console.error('Failed to log stage:', error);
      // Ne pas faire échouer le job pour un problème de log
    }
  }

  // Nettoyer les jobs lockés expirés
  async unlockExpiredJobs(): Promise<number> {
    const { data, error } = await supabase
      .rpc('unlock_expired_jobs');

    if (error) {
      throw new Error(`Failed to unlock expired jobs: ${error.message}`);
    }

    return data || 0;
  }

  // Obtenir les stats de la queue
  async getQueueStats(): Promise<any[]> {
    const { data, error } = await supabase
      .from('queue_stats')
      .select('*');

    if (error) {
      throw new Error(`Failed to get queue stats: ${error.message}`);
    }

    return data || [];
  }

  // Relancer un job depuis la dead letter queue
  async requeueDeadLetter(deadLetterJobId: string): Promise<string> {
    // Récupérer le job de la DLQ
    const { data: dlqJob, error: dlqError } = await supabase
      .from('dead_letter_queue')
      .select('*')
      .eq('id', deadLetterJobId)
      .single();

    if (dlqError) {
      throw new Error(`Failed to get dead letter job: ${dlqError.message}`);
    }

    // Le remettre en queue
    const newJobId = await this.enqueue(
      dlqJob.job_type,
      dlqJob.payload,
      { idempotencyKey: `requeue_${deadLetterJobId}_${Date.now()}` }
    );

    // Marquer comme retraité dans la DLQ
    await supabase
      .from('dead_letter_queue')
      .update({ can_retry: false })
      .eq('id', deadLetterJobId);

    return newJobId;
  }

  // Utilitaire pour générer une clé d'idempotence
  private generateIdempotencyKey(payload: JobPayload): string {
    const content = JSON.stringify(payload, Object.keys(payload).sort());
    return crypto
      .createHash('sha256')
      .update(content)
      .digest('hex')
      .substring(0, 32);
  }
}

// Factory pour les différents types de jobs
export class JobFactory {
  static createBookingSync(bookingData: any): JobPayload {
    return {
      type: 'booking_sync',
      booking_data: bookingData,
      correlation_id: `booking_${bookingData.id}`,
      timestamp: new Date().toISOString()
    };
  }

  static createStripeSetup(customerId: string, setupData: any): JobPayload {
    return {
      type: 'stripe_setup',
      customer_id: customerId,
      setup_data: setupData,
      correlation_id: `stripe_${customerId}`,
      timestamp: new Date().toISOString()
    };
  }

  static createEmailInvestor(recipientEmail: string, templateData: any): JobPayload {
    return {
      type: 'email_investor',
      recipient: recipientEmail,
      template_data: templateData,
      correlation_id: `email_${recipientEmail}`,
      timestamp: new Date().toISOString()
    };
  }

  static createNotionUpdate(pageId: string, updateData: any): JobPayload {
    return {
      type: 'notion_update',
      page_id: pageId,
      update_data: updateData,
      correlation_id: `notion_${pageId}`,
      timestamp: new Date().toISOString()
    };
  }
}

// Worker principal pour Make.com
export class MakeWorker {
  private queueClient: QueueClient;
  private webhookUrls: Record<string, string>;

  constructor(workerId?: string) {
    this.queueClient = new QueueClient(workerId);
    
    // URLs des webhooks Make.com pour chaque étape
    this.webhookUrls = {
      validate: process.env.MAKE_WEBHOOK_VALIDATE!,
      prepare: process.env.MAKE_WEBHOOK_PREPARE!,
      execute: process.env.MAKE_WEBHOOK_EXECUTE!,
      postprocess: process.env.MAKE_WEBHOOK_POSTPROCESS!,
      notify: process.env.MAKE_WEBHOOK_NOTIFY!
    };
  }

  // Boucle principale du worker (à appeler depuis Make.com toutes les minutes)
  async processNextJob(): Promise<{ processed: boolean; jobId?: string; error?: string }> {
    try {
      const job = await this.queueClient.getNextJob();
      
      if (!job) {
        return { processed: false };
      }

      console.log(`Processing job ${job.id} of type ${job.job_type}`);
      
      // Traiter le job via les sous-workflows
      await this.processJobStages(job);

      return { processed: true, jobId: job.id };

    } catch (error) {
      console.error('Worker error:', error);
      return { 
        processed: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Traiter un job via les sous-workflows modulaires
  private async processJobStages(job: QueueJob): Promise<void> {
    const stages = ['validate', 'prepare', 'execute', 'postprocess'];
    
    try {
      for (const stage of stages) {
        const startTime = Date.now();
        
        await this.queueClient.logStage(job.id!, stage, 'started');
        
        // Appel du sous-workflow via webhook
        const response = await this.callSubWorkflow(stage, job);
        
        const latency = Date.now() - startTime;
        
        if (!response.success) {
          throw new Error(`Stage ${stage} failed: ${response.error}`);
        }
        
        await this.queueClient.logStage(
          job.id!, 
          stage, 
          'success', 
          { response_data: response.data },
          latency
        );
      }

      // Job terminé avec succès
      await this.queueClient.completeJob(job.id!, { 
        completed_stages: stages,
        total_duration_ms: Date.now() - new Date(job.created_at!).getTime()
      });

      console.log(`Job ${job.id} completed successfully`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      await this.queueClient.logStage(
        job.id!, 
        'error', 
        'error',
        { error_details: errorMessage }
      );

      await this.queueClient.failJob(job.id!, errorMessage);
      
      console.error(`Job ${job.id} failed:`, errorMessage);
    }
  }

  // Appeler un sous-workflow via webhook
  private async callSubWorkflow(stage: string, job: QueueJob): Promise<any> {
    const webhookUrl = this.webhookUrls[stage];
    
    if (!webhookUrl) {
      throw new Error(`No webhook URL configured for stage: ${stage}`);
    }

    const payload = {
      job_id: job.id,
      job_type: job.job_type,
      stage,
      payload: job.payload,
      attempts: job.attempts,
      workflow_version: job.workflow_version
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Worker-ID': this.queueClient['workerId'],
        'X-Job-ID': job.id!
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Webhook call failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }
}

// Export de l'instance par défaut
export const queueClient = new QueueClient();