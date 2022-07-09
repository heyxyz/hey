const { withSentryConfig } = require('@sentry/nextjs')
const withTM = require('next-transpile-modules')(['plyr-react'])

const sentryWebpackPluginOptions = {
  silent: true
}

const headers = [{ key: 'Cache-Control', value: 'public, max-age=3600' }]

module.exports = withTM(
  withSentryConfig(
    {
      reactStrictMode: process.env.NODE_ENV === 'production',
      async redirects() {
        return [
          { source: '/about', headers },
          { source: '/privacy', headers },
          { source: '/thanks', headers }
        ]
      }
    },
    sentryWebpackPluginOptions
  )
)
