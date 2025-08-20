import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN

Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  
  // Error filtering
  beforeSend(event, hint) {
    // Filtrer les erreurs non critiques
    if (event.exception) {
      const error = hint.originalException
      
      // Ignorer les erreurs de réseau temporaires
      if (error?.message?.includes('NetworkError')) {
        return null
      }
      
      // Ignorer les erreurs de scripts tiers
      if (event.exception.values?.[0]?.stacktrace?.frames?.some(
        frame => frame.filename?.includes('third-party')
      )) {
        return null
      }
    }
    
    // Ajouter des contextes supplémentaires
    if (typeof window !== 'undefined') {
      event.contexts = {
        ...event.contexts,
        browser: {
          name: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        },
        custom: {
          memory: (performance as any).memory?.usedJSHeapSize,
          connection: (navigator as any).connection?.effectiveType,
        },
      }
    }
    
    return event
  },
  
  // Intégrations
  integrations: [
    new Sentry.BrowserTracing({
      tracingOrigins: ['localhost', 'windventure.fr', /^\//],
      routingInstrumentation: Sentry.nextRouterInstrumentation,
    }),
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
      maskAllInputs: true,
      networkDetailAllowUrls: ['/api'],
    }),
  ],
  
  // Ignorer certaines erreurs
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    'Network request failed',
    /^No user$/,
  ],
  
  // URLs à ignorer
  denyUrls: [
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
  ],
})