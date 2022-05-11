import * as Sentry from '@sentry/nextjs'

import { GIT_COMMIT_SHA, IS_PRODUCTION } from './src/constants'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: IS_PRODUCTION,
  release: GIT_COMMIT_SHA,
  tracesSampleRate: 1.0
})
