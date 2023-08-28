const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  reactStrictMode: false,
  trailingSlash: false,
  transpilePackages: ['data'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Max-Age', value: '1728000' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' }
        ]
      }
    ];
  }
};

module.exports = withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: 'lenster',
    project: 'prerender',
    url: 'https://sentry.lenster.xyz'
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    disableLogger: true,
    hideSourceMaps: false
  }
);
