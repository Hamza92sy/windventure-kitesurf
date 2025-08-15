-- 🚀 Architecture Queue Modulaire Windventure
-- Évite la limite 128 outils Make.com via queue + workers

-- Table principale de queue
CREATE TABLE IF NOT EXISTS queue_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_type TEXT NOT NULL, -- 'booking_sync', 'stripe_setup', 'email_investor', etc.
    status TEXT NOT NULL DEFAULT 'queued', -- queued, processing, done, retry_scheduled, dead_letter
    priority INTEGER DEFAULT 0, -- plus haut = plus prioritaire
    
    -- Payload et métadonnées
    payload JSONB NOT NULL,
    result JSONB,
    
    -- Idempotence & retry logic
    idempotency_key TEXT UNIQUE NOT NULL,
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    next_run TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Locking pour concurrence
    locked_by TEXT,
    locked_at TIMESTAMP WITH TIME ZONE,
    lock_ttl INTEGER DEFAULT 600, -- 10 minutes
    
    -- Versioning
    workflow_version TEXT DEFAULT 'v1.0',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    finished_at TIMESTAMP WITH TIME ZONE
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_queue_status_priority ON queue_jobs(status, priority DESC, next_run);
CREATE INDEX IF NOT EXISTS idx_queue_idempotency ON queue_jobs(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_queue_job_type ON queue_jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_queue_locked ON queue_jobs(locked_by, locked_at) WHERE status = 'processing';

-- Table dead letter queue
CREATE TABLE IF NOT EXISTS dead_letter_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_job_id UUID REFERENCES queue_jobs(id),
    job_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    last_error TEXT,
    error_count INTEGER DEFAULT 1,
    first_failed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_failed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    can_retry BOOLEAN DEFAULT true
);

-- Table audit trail 
CREATE TABLE IF NOT EXISTS job_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES queue_jobs(id),
    stage TEXT NOT NULL, -- 'validate', 'prepare', 'execute', 'postprocess'
    status TEXT NOT NULL, -- 'started', 'success', 'error'
    latency_ms INTEGER,
    error_code TEXT,
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✨ NOUVEAU: Table config système (circuit breaker, worker status, etc.)
CREATE TABLE IF NOT EXISTS system_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ✨ NOUVEAU: Table métriques business pour facturation client
CREATE TABLE IF NOT EXISTS business_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    job_type TEXT NOT NULL,
    
    -- Métriques de performance
    jobs_completed INTEGER DEFAULT 0,
    jobs_failed INTEGER DEFAULT 0,
    total_processing_time_ms BIGINT DEFAULT 0,
    avg_processing_time_ms INTEGER DEFAULT 0,
    
    -- Métriques SLA
    sla_target_ms INTEGER DEFAULT 120000, -- 2 minutes
    sla_violations INTEGER DEFAULT 0,
    success_rate_percent DECIMAL(5,2) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(date, job_type)
);

-- Fonction pour nettoyer les locks expirés
CREATE OR REPLACE FUNCTION unlock_expired_jobs()
RETURNS INTEGER AS $$
DECLARE
    unlocked_count INTEGER;
BEGIN
    UPDATE queue_jobs 
    SET 
        status = 'queued',
        locked_by = NULL,
        locked_at = NULL,
        attempts = attempts + 1
    WHERE 
        status = 'processing' 
        AND locked_at < NOW() - INTERVAL '1 second' * lock_ttl;
    
    GET DIAGNOSTICS unlocked_count = ROW_COUNT;
    RETURN unlocked_count;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour récupérer le prochain job (avec lock atomique)
CREATE OR REPLACE FUNCTION get_next_job(worker_id TEXT)
RETURNS TABLE(
    job_id UUID,
    job_type TEXT,
    payload JSONB,
    attempts INTEGER,
    workflow_version TEXT
) AS $$
DECLARE
    job_record RECORD;
    worker_paused BOOLEAN;
BEGIN
    -- ✨ NOUVEAU: Vérifier si le worker est en pause
    SELECT (value->>'status') = 'paused' INTO worker_paused
    FROM system_config 
    WHERE key = 'worker_status';
    
    IF worker_paused THEN
        RETURN; -- Pas de job si worker en pause
    END IF;

    -- Lock atomique du prochain job disponible
    UPDATE queue_jobs
    SET 
        status = 'processing',
        locked_by = worker_id,
        locked_at = NOW(),
        updated_at = NOW()
    WHERE id = (
        SELECT id 
        FROM queue_jobs 
        WHERE status = 'queued' 
        AND (next_run IS NULL OR next_run <= NOW())
        ORDER BY priority DESC, created_at ASC
        LIMIT 1
        FOR UPDATE SKIP LOCKED
    )
    RETURNING id, job_type, payload, attempts, workflow_version
    INTO job_record;
    
    IF job_record.id IS NOT NULL THEN
        RETURN QUERY SELECT 
            job_record.id,
            job_record.job_type,
            job_record.payload,
            job_record.attempts,
            job_record.workflow_version;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour marquer un job comme terminé
CREATE OR REPLACE FUNCTION complete_job(
    job_id UUID,
    job_result JSONB DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    job_record RECORD;
    processing_time INTEGER;
BEGIN
    -- Récupérer les infos du job pour les métriques
    SELECT job_type, created_at INTO job_record
    FROM queue_jobs WHERE id = job_id;
    
    -- Calculer le temps de traitement
    processing_time := EXTRACT(EPOCH FROM (NOW() - job_record.created_at)) * 1000;
    
    -- Marquer le job comme terminé
    UPDATE queue_jobs
    SET 
        status = 'done',
        result = job_result,
        finished_at = NOW(),
        updated_at = NOW(),
        locked_by = NULL,
        locked_at = NULL
    WHERE id = job_id;
    
    -- ✨ NOUVEAU: Mettre à jour les métriques business
    INSERT INTO business_metrics (date, job_type, jobs_completed, total_processing_time_ms, avg_processing_time_ms)
    VALUES (CURRENT_DATE, job_record.job_type, 1, processing_time, processing_time)
    ON CONFLICT (date, job_type) 
    DO UPDATE SET
        jobs_completed = business_metrics.jobs_completed + 1,
        total_processing_time_ms = business_metrics.total_processing_time_ms + processing_time,
        avg_processing_time_ms = (business_metrics.total_processing_time_ms + processing_time) / (business_metrics.jobs_completed + 1),
        updated_at = NOW();
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour marquer un job en erreur avec retry
CREATE OR REPLACE FUNCTION fail_job(
    job_id UUID,
    error_message TEXT,
    retry_delay_seconds INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    job_record RECORD;
    calculated_delay INTEGER;
BEGIN
    -- Récupérer les infos du job
    SELECT job_type, attempts, max_attempts INTO job_record 
    FROM queue_jobs WHERE id = job_id;
    
    IF job_record.attempts + 1 >= job_record.max_attempts THEN
        -- Déplacer vers dead letter queue
        INSERT INTO dead_letter_queue (original_job_id, job_type, payload, last_error)
        SELECT id, job_type, payload, error_message
        FROM queue_jobs WHERE id = job_id;
        
        UPDATE queue_jobs
        SET 
            status = 'dead_letter',
            result = jsonb_build_object('error', error_message),
            finished_at = NOW(),
            updated_at = NOW(),
            locked_by = NULL,
            locked_at = NULL
        WHERE id = job_id;
        
        -- ✨ NOUVEAU: Mettre à jour les métriques d'échec
        INSERT INTO business_metrics (date, job_type, jobs_failed)
        VALUES (CURRENT_DATE, job_record.job_type, 1)
        ON CONFLICT (date, job_type) 
        DO UPDATE SET
            jobs_failed = business_metrics.jobs_failed + 1,
            updated_at = NOW();
            
        -- ✨ NOUVEAU: Circuit breaker - incrémenter les échecs
        INSERT INTO system_config (key, value)
        VALUES ('circuit_breaker_status', jsonb_build_object(
            'status', 'open',
            'failure_count', 1,
            'last_failure', NOW()
        ))
        ON CONFLICT (key)
        DO UPDATE SET
            value = jsonb_set(
                jsonb_set(system_config.value, '{failure_count}', 
                         to_jsonb((system_config.value->>'failure_count')::int + 1)),
                '{last_failure}', to_jsonb(NOW())),
            updated_at = NOW();
            
    ELSE
        -- Programmer retry avec backoff exponentiel
        calculated_delay := COALESCE(
            retry_delay_seconds,
            LEAST(3600, POWER(2, job_record.attempts) * 60) -- 1m, 2m, 4m, 8m... max 1h
        );
        
        UPDATE queue_jobs
        SET 
            status = 'retry_scheduled',
            attempts = attempts + 1,
            next_run = NOW() + INTERVAL '1 second' * calculated_delay,
            updated_at = NOW(),
            locked_by = NULL,
            locked_at = NULL
        WHERE id = job_id;
    END IF;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ✨ NOUVEAU: Fonction de nettoyage automatique des vieux jobs
CREATE OR REPLACE FUNCTION cleanup_old_jobs()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Supprimer les jobs terminés de plus de 30 jours
    DELETE FROM queue_jobs 
    WHERE status IN ('done', 'dead_letter') 
    AND finished_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Nettoyer les logs d'audit de plus de 90 jours
    DELETE FROM job_audit_logs 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Nettoyer la dead letter queue de plus de 7 jours si can_retry = false
    DELETE FROM dead_letter_queue 
    WHERE can_retry = false 
    AND last_failed_at < NOW() - INTERVAL '7 days';
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Vue pour monitoring avec métriques SLA
CREATE OR REPLACE VIEW queue_stats AS
SELECT 
    job_type,
    status,
    COUNT(*) as count,
    AVG(EXTRACT(EPOCH FROM (finished_at - created_at))) as avg_duration_seconds,
    MIN(created_at) as oldest_job,
    MAX(updated_at) as latest_activity,
    -- ✨ NOUVEAU: Métriques SLA
    COUNT(*) FILTER (WHERE 
        status = 'done' 
        AND EXTRACT(EPOCH FROM (finished_at - created_at)) > 120
    ) as sla_violations_2min,
    COUNT(*) FILTER (WHERE 
        status = 'done' 
        AND EXTRACT(EPOCH FROM (finished_at - created_at)) <= 120
    ) as sla_compliant_2min
FROM queue_jobs
WHERE created_at > NOW() - INTERVAL '24 hours' -- Focus sur les dernières 24h
GROUP BY job_type, status
ORDER BY job_type, status;

-- ✨ NOUVEAU: Vue business metrics pour facturation/reporting client
CREATE OR REPLACE VIEW daily_business_report AS
SELECT 
    date,
    job_type,
    jobs_completed,
    jobs_failed,
    (jobs_completed::float / NULLIF(jobs_completed + jobs_failed, 0) * 100)::decimal(5,2) as success_rate_percent,
    avg_processing_time_ms,
    sla_violations,
    CASE 
        WHEN avg_processing_time_ms <= sla_target_ms THEN 'MEETING'
        WHEN avg_processing_time_ms <= sla_target_ms * 1.2 THEN 'AT_RISK' 
        ELSE 'VIOLATED'
    END as sla_status,
    -- Calcul du coût estimé (facturation client)
    CASE job_type
        WHEN 'booking_sync' THEN jobs_completed * 0.50 -- 0.50€ par booking
        WHEN 'email_investor' THEN jobs_completed * 0.20 -- 0.20€ par email
        WHEN 'stripe_setup' THEN jobs_completed * 1.00 -- 1€ par setup Stripe
        ELSE jobs_completed * 0.30 -- 0.30€ par défaut
    END as estimated_revenue_eur
FROM business_metrics
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY date DESC, job_type;

-- ✨ NOUVEAU: Trigger pour circuit breaker automatique
CREATE OR REPLACE FUNCTION circuit_breaker_trigger()
RETURNS TRIGGER AS $$
DECLARE
    failure_count INTEGER;
    should_pause BOOLEAN := false;
BEGIN
    -- Si c'est un échec (dead_letter), vérifier le circuit breaker
    IF NEW.status = 'dead_letter' AND OLD.status != 'dead_letter' THEN
        
        SELECT (value->>'failure_count')::int INTO failure_count
        FROM system_config 
        WHERE key = 'circuit_breaker_status';
        
        -- Si plus de 5 échecs en 10 minutes, pause le worker
        IF failure_count >= 5 THEN
            INSERT INTO system_config (key, value)
            VALUES ('worker_status', jsonb_build_object(
                'status', 'paused',
                'reason', 'Circuit breaker activated - too many failures',
                'paused_at', NOW()
            ))
            ON CONFLICT (key) 
            DO UPDATE SET 
                value = jsonb_build_object(
                    'status', 'paused',
                    'reason', 'Circuit breaker activated - too many failures',
                    'paused_at', NOW()
                ),
                updated_at = NOW();
                
            -- TODO: Envoyer notification Slack/email d'alerte critique
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER circuit_breaker_check
    AFTER UPDATE ON queue_jobs
    FOR EACH ROW
    EXECUTE FUNCTION circuit_breaker_trigger();

-- Permissions
GRANT ALL ON queue_jobs TO authenticated;
GRANT ALL ON dead_letter_queue TO authenticated;
GRANT ALL ON job_audit_logs TO authenticated;
GRANT ALL ON system_config TO authenticated;
GRANT ALL ON business_metrics TO authenticated;
GRANT SELECT ON queue_stats TO authenticated;
GRANT SELECT ON daily_business_report TO authenticated;
GRANT EXECUTE ON FUNCTION get_next_job(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION complete_job(UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION fail_job(UUID, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION unlock_expired_jobs() TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_jobs() TO authenticated;

-- ✨ NOUVEAU: Cron job pour nettoyage automatique (si pg_cron disponible)
-- SELECT cron.schedule('cleanup-old-jobs', '0 2 * * *', 'SELECT cleanup_old_jobs();');

-- ✨ NOUVEAU: Insertions par défaut pour config système
INSERT INTO system_config (key, value) 
VALUES 
    ('worker_status', '{"status": "active"}'),
    ('circuit_breaker_status', '{"status": "closed", "failure_count": 0}'),
    ('monitoring_settings', '{"alert_threshold_queue_size": 100, "sla_target_seconds": 120}')
ON CONFLICT (key) DO NOTHING;