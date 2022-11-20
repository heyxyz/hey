/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['lens', 'data', 'abis']);

module.exports = withTM({
  reactStrictMode: false,
  trailingSlash: false,
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Max-Age', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: '1728000' }
        ]
      }
    ];
  }
});
