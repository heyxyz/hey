/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')
const withTM = require('next-transpile-modules')(['plyr-react'])
const { withAxiom } = require('next-axiom')

const headers = [{ key: 'Cache-Control', value: 'public, max-age=3600' }]
const useCDN = process.env.USE_ASSETS_CDN === 'true'

module.exports = withAxiom(
  withTM(
    withSentryConfig(
      {
        reactStrictMode: false,
        trailingSlash: false,
        assetPrefix: useCDN ? 'https://lensterassets.xyz' : '',
        async rewrites() {
          return [
            {
              source: '/sitemap.xml',
              destination: 'https://sitemap.lenster.xyz/sitemap.xml'
            },
            {
              source: '/sitemaps/:match*',
              destination: 'https://sitemap.lenster.xyz/sitemaps/:match*'
            }
          ]
        },
        async redirects() {
          return [
            {
              source: '/discord',
              destination: 'https://discord.com/invite/B8eKhSSUwX',
              permanent: true
            },
            {
              source: '/donate',
              destination: 'https://gitcoin.co/grants/5007/lenster',
              permanent: true
            }
          ]
        },
        async headers() {
          return [
            {
              source: '/(.*)',
              headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'X-Frame-Options', value: 'DENY' },
                { key: 'X-XSS-Protection', value: '1; mode=block' },
                { key: 'Referrer-Policy', value: 'strict-origin' },
                { key: 'Permissions-Policy', value: 'interest-cohort=()' }
              ]
            },
            { source: '/about', headers },
            { source: '/privacy', headers },
            { source: '/thanks', headers }
          ]
        }
      },
      { silent: true } // Sentry config
    )
  )
)
