import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

Sentry.init({
  dsn:
    SENTRY_DSN ||
    'https://5faafe3b567e4edea66be9b0d191d16f@o180224.ingest.sentry.io/6306061',
  tracesSampleRate: 1.0
})
