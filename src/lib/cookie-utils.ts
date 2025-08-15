/**
 * 🛡️ WINDVENTURE SECURITY CORE - Cookie Utilities
 * Utilitaires pour la gestion des cookies et du consentement RGPD
 */

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export const COOKIE_CONSENT_KEY = 'windventure-cookie-consent';

/**
 * Récupère les préférences de cookies depuis le localStorage
 */
export function getCookieConsent(): CookiePreferences | null {
  if (typeof window === 'undefined') return null;

  try {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    return consent ? JSON.parse(consent) : null;
  } catch (error) {
    console.error('Erreur lors de la récupération du consentement:', error);
    return null;
  }
}

/**
 * Vérifie si le consentement a été donné
 */
export function hasCookieConsent(): boolean {
  return getCookieConsent() !== null;
}

/**
 * Vérifie si un type de cookie spécifique est autorisé
 */
export function isCookieAllowed(type: keyof CookiePreferences): boolean {
  const consent = getCookieConsent();
  if (!consent) return false;

  // Les cookies nécessaires sont toujours autorisés
  if (type === 'necessary') return true;

  return consent[type] || false;
}

/**
 * Active les scripts selon les préférences de consentement
 */
export function enableScriptsByConsent(): void {
  if (typeof window === 'undefined') return;

  const consent = getCookieConsent();
  if (!consent) return;

  // Google Analytics
  if (window.gtag && consent.analytics) {
    window.gtag('consent', 'update', {
      analytics_storage: 'granted',
      ad_storage: consent.marketing ? 'granted' : 'denied',
      functionality_storage: consent.preferences ? 'granted' : 'denied',
      personalization_storage: consent.preferences ? 'granted' : 'denied',
    });
  }

  // Autres scripts selon les préférences
  if (consent.marketing) {
    // Activer les scripts marketing
    enableMarketingScripts();
  }

  if (consent.preferences) {
    // Activer les scripts de préférences
    enablePreferenceScripts();
  }
}

/**
 * Active les scripts marketing
 */
function enableMarketingScripts(): void {
  // Facebook Pixel, Google Ads, etc.
  console.log('Scripts marketing activés');
}

/**
 * Active les scripts de préférences
 */
function enablePreferenceScripts(): void {
  // Scripts de personnalisation
  console.log('Scripts de préférences activés');
}

/**
 * Bloque tous les scripts non nécessaires
 */
export function blockNonEssentialScripts(): void {
  if (typeof window === 'undefined') return;

  // Bloquer Google Analytics
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
    });
  }

  // Bloquer reCAPTCHA (sauf si nécessaire)
  // Note: reCAPTCHA peut être nécessaire pour certains formulaires
}

/**
 * Supprime le consentement (pour les tests)
 */
export function clearCookieConsent(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(COOKIE_CONSENT_KEY);
}

/**
 * Vérifie si le site est en mode développement
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Log les préférences de cookies (en développement)
 */
export function logCookiePreferences(): void {
  if (!isDevelopment()) return;

  const consent = getCookieConsent();
  console.log('🍪 Préférences de cookies:', consent);
}
