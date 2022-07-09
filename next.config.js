const { withSentryConfig } = require('@sentry/nextjs')
const withTM = require('next-transpile-modules')(['plyr-react'])

const sentryWebpackPluginOptions = {
  silent: true
}

module.exports = withTM(
  withSentryConfig(
    {
      reactStrictMode: process.env.NODE_ENV === 'production'
    },
    sentryWebpackPluginOptions
  )
)
