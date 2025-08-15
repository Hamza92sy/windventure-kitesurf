import { NextRequest, NextResponse } from 'next/server';
import { queueClient } from '@/lib/queue-client';

// 📊 DASHBOARD MONITORING EN TEMPS RÉEL
// Endpoint pour Notion dashboard et monitoring Make.com

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'json'; // json, notion, make

    // Récupérer les stats complètes
    const [queueStats, systemHealth, recentJobs] = await Promise.all([
      queueClient.getQueueStats(),
      getSystemHealth(),
      getRecentJobsActivity()
    ]);

    // Calculer les métriques business
    const businessMetrics = calculateBusinessMetrics(queueStats, recentJobs);

    // Alertes automatiques
    const alerts = generateAlerts(queueStats, systemHealth);

    const statusData = {
      timestamp: new Date().toISOString(),
      system_health: systemHealth,
      queue_stats: queueStats,
      business_metrics: businessMetrics,
      recent_activity: recentJobs,
      alerts,
      circuit_breaker: await getCircuitBreakerStatus()
    };

    // Format selon le consommateur
    switch (format) {
      case 'notion':
        return NextResponse.json(formatForNotion(statusData));
      case 'make':
        return NextResponse.json(formatForMake(statusData));
      default:
        return NextResponse.json(statusData);
    }

  } catch (error) {
    console.error('Status endpoint error:', error);
    
    return NextResponse.json({
      error: 'Failed to get queue status',
      timestamp: new Date().toISOString(),
      system_health: 'error'
    }, { status: 500 });
  }
}

// POST pour déclencher des actions (pause/resume worker, reset alerts)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, params = {} } = body;

    let result;

    switch (action) {
      case 'pause_worker':
        result = await pauseWorker(params.reason);
        break;
      
      case 'resume_worker':
        result = await resumeWorker();
        break;
      
      case 'reset_circuit_breaker':
        result = await resetCircuitBreaker();
        break;
      
      case 'clear_dead_letter':
        result = await clearDeadLetterQueue();
        break;
      
      case 'force_unlock_jobs':
        result = await queueClient.unlockExpiredJobs();
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return NextResponse.json({
      success: true,
      action,
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Status action error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}

// Santé système globale
async function getSystemHealth() {
  const checks = {};
  let overallHealth = 'healthy';

  try {
    // Test connexion Supabase
    const supabaseTest = await queueClient.getQueueStats();
    checks.supabase = supabaseTest ? 'healthy' : 'error';
  } catch {
    checks.supabase = 'error';
    overallHealth = 'error';
  }

  try {
    // Test Make.com webhooks (ping simple)
    const webhookTests = await Promise.allSettled([
      fetch(process.env.MAKE_WEBHOOK_VALIDATE!, { method: 'HEAD', timeout: 5000 }),
      fetch(process.env.MAKE_WEBHOOK_PREPARE!, { method: 'HEAD', timeout: 5000 })
    ]);
    
    checks.make_webhooks = webhookTests.every(r => r.status === 'fulfilled') ? 'healthy' : 'degraded';
    if (checks.make_webhooks === 'degraded' && overallHealth === 'healthy') {
      overallHealth = 'degraded';
    }
  } catch {
    checks.make_webhooks = 'error';
    overallHealth = 'error';
  }

  // Vérifier la charge système
  const systemLoad = await getSystemLoad();
  checks.system_load = systemLoad;
  
  if (systemLoad.cpu_usage > 80 || systemLoad.memory_usage > 85) {
    overallHealth = overallHealth === 'healthy' ? 'degraded' : overallHealth;
  }

  return {
    status: overallHealth,
    checks,
    last_updated: new Date().toISOString()
  };
}

// Activité récente des jobs
async function getRecentJobsActivity() {
  const { data, error } = await queueClient['supabase']
    .from('queue_jobs')
    .select('id, job_type, status, created_at, finished_at, attempts')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    throw error;
  }

  return data.map(job => ({
    ...job,
    duration_ms: job.finished_at ? 
      new Date(job.finished_at).getTime() - new Date(job.created_at).getTime() : 
      null
  }));
}

// Métriques business pour le pricing/SLA client
function calculateBusinessMetrics(queueStats: any[], recentJobs: any[]) {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const jobsLast24h = recentJobs.filter(job => 
    new Date(job.created_at) > last24h
  );

  const completedJobs = jobsLast24h.filter(job => job.status === 'done');
  const failedJobs = jobsLast24h.filter(job => job.status === 'dead_letter');
  
  // Calculs SLA
  const avgProcessingTime = completedJobs.reduce((acc, job) => 
    acc + (job.duration_ms || 0), 0
  ) / (completedJobs.length || 1);

  const successRate = completedJobs.length / (jobsLast24h.length || 1) * 100;
  
  // Métriques par type de job (pour facturation client)
  const jobTypeMetrics = {};
  completedJobs.forEach(job => {
    if (!jobTypeMetrics[job.job_type]) {
      jobTypeMetrics[job.job_type] = {
        count: 0,
        total_duration_ms: 0,
        avg_duration_ms: 0
      };
    }
    jobTypeMetrics[job.job_type].count++;
    jobTypeMetrics[job.job_type].total_duration_ms += job.duration_ms || 0;
  });

  Object.keys(jobTypeMetrics).forEach(type => {
    const metrics = jobTypeMetrics[type];
    metrics.avg_duration_ms = metrics.total_duration_ms / metrics.count;
  });

  return {
    period: '24h',
    jobs_processed: jobsLast24h.length,
    jobs_completed: completedJobs.length,
    jobs_failed: failedJobs.length,
    success_rate_percent: Math.round(successRate * 100) / 100,
    avg_processing_time_seconds: Math.round(avgProcessingTime / 1000),
    throughput_per_hour: Math.round(jobsLast24h.length / 24),
    job_type_breakdown: jobTypeMetrics,
    sla_status: successRate >= 95 && avgProcessingTime < 120000 ? 'meeting' : 'at_risk'
  };
}

// Circuit breaker - pause worker si trop d'échecs
async function getCircuitBreakerStatus() {
  const key = 'circuit_breaker_status';
  
  // Récupérer le statut depuis un cache simple (localStorage, Redis, ou Supabase)
  try {
    const { data } = await queueClient['supabase']
      .from('system_config')
      .select('value')
      .eq('key', key)
      .single();

    return data?.value || { status: 'closed', failure_count: 0, last_failure: null };
  } catch {
    return { status: 'closed', failure_count: 0, last_failure: null };
  }
}

// Génération d'alertes automatiques
function generateAlerts(queueStats: any[], systemHealth: any) {
  const alerts = [];

  // Alert 1: Trop de jobs en queue
  const queuedCount = queueStats
    .filter(stat => stat.status === 'queued')
    .reduce((sum, stat) => sum + stat.count, 0);
  
  if (queuedCount > 100) {
    alerts.push({
      level: 'warning',
      type: 'high_queue_size',
      message: `${queuedCount} jobs en attente - consider scaling`,
      action: 'scale_workers'
    });
  }

  // Alert 2: Jobs processing depuis trop longtemps
  const processingCount = queueStats
    .filter(stat => stat.status === 'processing')
    .reduce((sum, stat) => sum + stat.count, 0);
  
  if (processingCount > 10) {
    alerts.push({
      level: 'critical',
      type: 'stuck_jobs',
      message: `${processingCount} jobs bloqués en processing`,
      action: 'unlock_expired_jobs'
    });
  }

  // Alert 3: Santé système dégradée
  if (systemHealth.status === 'error') {
    alerts.push({
      level: 'critical',
      type: 'system_error',
      message: 'Système en erreur - vérifier les connexions',
      action: 'investigate_system_health'
    });
  }

  return alerts;
}

// Format pour dashboard Notion
function formatForNotion(statusData: any) {
  return {
    properties: {
      'System Status': {
        select: { 
          name: statusData.system_health.status === 'healthy' ? '🟢 Healthy' : 
                statusData.system_health.status === 'degraded' ? '🟡 Degraded' : '🔴 Error'
        }
      },
      'Jobs in Queue': {
        number: statusData.queue_stats
          .filter(s => s.status === 'queued')
          .reduce((sum, s) => sum + s.count, 0)
      },
      'Jobs Processing': {
        number: statusData.queue_stats
          .filter(s => s.status === 'processing')
          .reduce((sum, s) => sum + s.count, 0)
      },
      'Success Rate (24h)': {
        number: statusData.business_metrics.success_rate_percent
      },
      'Avg Processing Time': {
        rich_text: [{
          type: 'text',
          text: { content: `${statusData.business_metrics.avg_processing_time_seconds}s` }
        }]
      },
      'Last Updated': {
        date: { start: statusData.timestamp }
      }
    }
  };
}

// Format pour Make.com (plus compact)
function formatForMake(statusData: any) {
  return {
    status: statusData.system_health.status,
    queued_jobs: statusData.queue_stats
      .filter(s => s.status === 'queued')
      .reduce((sum, s) => sum + s.count, 0),
    processing_jobs: statusData.queue_stats
      .filter(s => s.status === 'processing')
      .reduce((sum, s) => sum + s.count, 0),
    alerts_count: statusData.alerts.length,
    circuit_breaker: statusData.circuit_breaker.status,
    should_pause_worker: statusData.alerts.some(a => a.level === 'critical'),
    timestamp: statusData.timestamp
  };
}

// Actions système
async function pauseWorker(reason: string) {
  // Marquer le worker comme pausé dans la config
  await queueClient['supabase']
    .from('system_config')
    .upsert({
      key: 'worker_status',
      value: { status: 'paused', reason, paused_at: new Date().toISOString() }
    });
  
  return { status: 'paused', reason };
}

async function resumeWorker() {
  await queueClient['supabase']
    .from('system_config')
    .upsert({
      key: 'worker_status',
      value: { status: 'active', resumed_at: new Date().toISOString() }
    });
  
  return { status: 'active' };
}

async function resetCircuitBreaker() {
  await queueClient['supabase']
    .from('system_config')
    .upsert({
      key: 'circuit_breaker_status',
      value: { status: 'closed', failure_count: 0, reset_at: new Date().toISOString() }
    });
  
  return { status: 'reset' };
}

async function clearDeadLetterQueue() {
  const { count } = await queueClient['supabase']
    .from('dead_letter_queue')
    .delete()
    .gte('first_failed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
  
  return { cleared_jobs: count };
}

async function getSystemLoad() {
  // Simulation - remplace par vraies métriques si disponibles
  return {
    cpu_usage: Math.random() * 50,
    memory_usage: Math.random() * 60,
    queue_size: await queueClient.getQueueStats().then(stats => 
      stats.filter(s => s.status === 'queued').reduce((sum, s) => sum + s.count, 0)
    )
  };
}