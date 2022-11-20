/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['data']);

module.exports = withTM({
  reactStrictMode: false,
  trailingSlash: false,
  async rewrites() {
    return [{ source: '/:path*', destination: '/api/:path*' }];
  },
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
});
