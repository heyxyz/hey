import * as Sentry from '@sentry/nextjs';

Sentry.init({
  debug: false,
  dsn: 'https://e59a95ba0b70b237301fbc5fcb8e71db@o180224.ingest.sentry.io/4506721358512128',
  integrations: [
    Sentry.replayIntegration({
      blockAllMedia: true,
      maskAllText: true
    })
  ],
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  tracesSampleRate: 1
});
