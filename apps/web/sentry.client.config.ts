import * as Sentry from '@sentry/nextjs';

Sentry.init({
  debug: false,
  dsn: 'https://b23e88b586ee5e1a4cf1afbabc6585a9@o180224.ingest.us.sentry.io/4507555324755968',
  enabled: process.env.NODE_ENV === 'production',
  ignoreErrors: [
    'ResizeObserver loop completed with undelivered notifications.',
    'ResizeObserver loop limit exceeded',
    'User rejected the request',
    'wss://relay.walletconnect.org',
    'To use QR modal, please install @walletconnect/modal package',
    'WebSocket connection failed for host: wss://relay.walletconnect.com',
    'No matching key',
    'unknown ProviderEvent',
    'No internet connection detected',
    'No injected ethereum object.',
    "Cannot read properties of null (reading 'onError')",
    'Request Aborted'
  ],
  integrations: [Sentry.browserProfilingIntegration()],
  profilesSampleRate: 1.0,
  tracePropagationTargets: ['hey.xyz'],
  tracesSampleRate: 1.0
});
