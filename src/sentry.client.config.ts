import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 1.0,

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Environnement
  environment: process.env.NODE_ENV,

  // Filtrer les erreurs non critiques
  beforeSend(event) {
    // Ignorer les erreurs de bots/crawlers
    if (event.user?.ip_address?.includes('bot')) {
      return null;
    }
    return event;
  },

  integrations: [],
});
