import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: 'https://ea87088dce4e7b2b02221a2edc5c9c56@o180224.ingest.us.sentry.io/4506721358512128',
  tracesSampleRate: 1.0
});
