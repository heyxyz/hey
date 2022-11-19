/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['lens', 'data', 'abis']);

module.exports = withTM({
  reactStrictMode: false,
  trailingSlash: false,
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }]
      }
    ];
  }
});
