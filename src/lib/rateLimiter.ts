import { RateLimiterMemory } from 'rate-limiter-flexible';

// Configuration de sécurité dynamique
const SECURITY_MODE = process.env.SECURITY_MODE || 'strict';

// Limites selon le mode de sécurité
const RATE_LIMITS = {
  strict: {
    contact: { points: 3, duration: 60 }, // 3 requêtes par minute
    checkout: { points: 2, duration: 60 }, // 2 requêtes par minute
    webhook: { points: 10, duration: 60 }, // 10 requêtes par minute
    general: { points: 100, duration: 60 }, // 100 requêtes par minute
  },
  normal: {
    contact: { points: 5, duration: 60 },
    checkout: { points: 3, duration: 60 },
    webhook: { points: 20, duration: 60 },
    general: { points: 200, duration: 60 },
  },
};

const limits =
  RATE_LIMITS[SECURITY_MODE as keyof typeof RATE_LIMITS] || RATE_LIMITS.normal;

// Rate limiters en mémoire (à remplacer par Redis en production)
export const rateLimiters = {
  contact: new RateLimiterMemory({
    points: limits.contact.points,
    duration: limits.contact.duration,
    blockDuration: 60 * 15, // Blocage de 15 minutes
  }),

  checkout: new RateLimiterMemory({
    points: limits.checkout.points,
    duration: limits.checkout.duration,
    blockDuration: 60 * 30, // Blocage de 30 minutes
  }),

  webhook: new RateLimiterMemory({
    points: limits.webhook.points,
    duration: limits.webhook.duration,
    blockDuration: 60 * 5, // Blocage de 5 minutes
  }),

  general: new RateLimiterMemory({
    points: limits.general.points,
    duration: limits.general.duration,
    blockDuration: 60 * 10, // Blocage de 10 minutes
  }),
};

// Types pour les requêtes
interface RateLimitRequest {
  ip?: string;
  userAgent?: string;
  pathname?: string;
}

interface RateLimitResponse {
  success: boolean;
  remainingPoints: number;
  resetTime: number;
  blocked: boolean;
  error?: string;
}

// Fonction principale de rate limiting
export async function checkRateLimit(
  type: keyof typeof rateLimiters,
  req: RateLimitRequest
): Promise<RateLimitResponse> {
  try {
    const limiter = rateLimiters[type];
    const key = req.ip || 'unknown';

    // Vérification du rate limit
    const res = await limiter.get(key);

    if (res !== null && res.consumedPoints >= limiter.points) {
      // Utilisateur bloqué
      return {
        success: false,
        remainingPoints: 0,
        resetTime: res.msBeforeNext,
        blocked: true,
        error: `Rate limit exceeded. Try again in ${Math.ceil(res.msBeforeNext / 1000)} seconds.`,
      };
    }

    // Consommation d'un point
    await limiter.consume(key);

    // Log de sécurité si mode strict
    if (SECURITY_MODE === 'strict') {
      console.log(
        `📊 [RATE_LIMIT] ${type} - IP: ${key} - Remaining: ${res ? limiter.points - res.consumedPoints - 1 : limiter.points - 1}`
      );
    }

    return {
      success: true,
      remainingPoints: res
        ? limiter.points - res.consumedPoints - 1
        : limiter.points - 1,
      resetTime: res ? res.msBeforeNext : 0,
      blocked: false,
    };
  } catch (error) {
    console.error(`❌ [RATE_LIMIT_ERROR] ${type}:`, error);

    // En cas d'erreur, on autorise la requête mais on log
    return {
      success: true,
      remainingPoints: 0,
      resetTime: 0,
      blocked: false,
      error: 'Rate limiter error, request allowed',
    };
  }
}

// Fonction pour récupérer les statistiques de rate limiting
export async function getRateLimitStats(
  type: keyof typeof rateLimiters,
  ip: string
) {
  try {
    const limiter = rateLimiters[type];
    const res = await limiter.get(ip);

    return {
      consumedPoints: res?.consumedPoints || 0,
      remainingPoints: res
        ? limiter.points - res.consumedPoints
        : limiter.points,
      resetTime: res?.msBeforeNext || 0,
      isBlocked:
        typeof res?.consumedPoints === 'number' &&
        res.consumedPoints >= limiter.points,
    };
  } catch (error) {
    console.error(`❌ [RATE_LIMIT_STATS_ERROR] ${type}:`, error);
    return null;
  }
}

// Fonction pour réinitialiser le rate limit d'une IP (admin only)
export async function resetRateLimit(
  type: keyof typeof rateLimiters,
  ip: string
) {
  try {
    const limiter = rateLimiters[type];
    await limiter.delete(ip);
    console.log(`🔄 [RATE_LIMIT_RESET] ${type} - IP: ${ip}`);
    return true;
  } catch (error) {
    console.error(`❌ [RATE_LIMIT_RESET_ERROR] ${type}:`, error);
    return false;
  }
}

// Middleware Express/Next.js pour le rate limiting
export function createRateLimitMiddleware(type: keyof typeof rateLimiters) {
  return async (req: any, res: any, next?: any) => {
    const rateLimitResult = await checkRateLimit(type, {
      ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      userAgent: req.headers['user-agent'],
      pathname: req.url,
    });

    if (!rateLimitResult.success || rateLimitResult.blocked) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: rateLimitResult.error || 'Rate limit exceeded',
        retryAfter: Math.ceil(rateLimitResult.resetTime / 1000),
      });
    }

    // Ajout des headers de rate limiting
    res.setHeader('X-RateLimit-Limit', rateLimiters[type].points);
    res.setHeader('X-RateLimit-Remaining', rateLimitResult.remainingPoints);
    res.setHeader(
      'X-RateLimit-Reset',
      Math.ceil(Date.now() / 1000) + Math.ceil(rateLimitResult.resetTime / 1000)
    );

    if (next) next();
  };
}
