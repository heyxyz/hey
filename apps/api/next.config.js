/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['lens', 'data', 'abis']);

module.exports = withTM({
  reactStrictMode: false,
  trailingSlash: false,
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
      }
    ];
  }
});
