import { NextRequest, NextResponse } from 'next/server';
import { MakeWorker } from '@/lib/queue-client';

// 🎯 SCÉNARIO B : WORKER
// À appeler depuis Make.com toutes les minutes (Scheduler)
// Max simultaneous runs = 1 pour éviter la concurrence

let workerInstance: MakeWorker | null = null;

export async function POST(req: NextRequest) {
  try {
    // Initialiser le worker si nécessaire
    if (!workerInstance) {
      const workerId = `make_worker_${process.env.VERCEL_REGION || 'local'}_${Date.now()}`;
      workerInstance = new MakeWorker(workerId);
      console.log(`🤖 Worker initialized: ${workerId}`);
    }

    console.log('🔄 Worker checking for jobs...');

    // Nettoyer les locks expirés avant de traiter
    const unlockedCount = await workerInstance['queueClient'].unlockExpiredJobs();
    if (unlockedCount > 0) {
      console.log(`🔓 Unlocked ${unlockedCount} expired jobs`);
    }

    // Traiter le prochain job disponible
    const result = await workerInstance.processNextJob();

    if (result.processed) {
      console.log(`✅ Job ${result.jobId} processed successfully`);
      
      return NextResponse.json({
        success: true,
        processed: true,
        job_id: result.jobId,
        timestamp: new Date().toISOString(),
        message: 'Job processed successfully'
      });
    } else {
      console.log('📭 No jobs available for processing');
      
      return NextResponse.json({
        success: true,
        processed: false,
        message: 'No jobs available',
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('❌ Worker error:', error);
    
    // Log l'erreur mais ne pas faire échouer Make.com
    return NextResponse.json({
      success: false,
      processed: false,
      error: error instanceof Error ? error.message : 'Unknown worker error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// GET pour obtenir des stats du worker
export async function GET(req: NextRequest) {
  try {
    if (!workerInstance) {
      return NextResponse.json({
        worker_status: 'not_initialized',
        queue_stats: []
      });
    }

    const queueStats = await workerInstance['queueClient'].getQueueStats();
    
    return NextResponse.json({
      worker_status: 'active',
      worker_id: workerInstance['queueClient']['workerId'],
      queue_stats: queueStats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Worker stats error:', error);
    
    return NextResponse.json({
      error: 'Failed to get worker stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}