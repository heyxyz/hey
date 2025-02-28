import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true"
});

const allowedBots =
  ".*(bot|telegram|baidu|bing|yandex|iframely|whatsapp|facebook).*";

// Remove data-testid from production
const isDevelopment = process.env.NODE_ENV === "development";
const compilerOptions = isDevelopment
  ? {}
  : { compiler: { reactRemoveProperties: { properties: ["^data-testid$"] } } };

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...compilerOptions,
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  reactStrictMode: false,
  devIndicators: false,
  headers() {
    return [
      {
        headers: [
          { key: "Referrer-Policy", value: "strict-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" }
        ],
        source: "/(.*)"
      }
    ];
  },
  redirects() {
    return [
      {
        destination: "https://discord.com/invite/B8eKhSSUwX",
        permanent: true,
        source: "/discord"
      },
      {
        destination:
          "https://explorer.gitcoin.co/#/round/42161/608/6?utm_source=hey.xyz",
        permanent: true,
        source: "/gitcoin"
      }
    ];
  },
  rewrites() {
    return [
      {
        destination: "https://og.hey.xyz/u/:match*",
        has: [{ key: "user-agent", type: "header", value: allowedBots }],
        source: "/u/:match*"
      },
      {
        destination: "https://og.hey.xyz/posts/:match*",
        has: [{ key: "user-agent", type: "header", value: allowedBots }],
        source: "/posts/:match*"
      }
    ];
  },
  transpilePackages: ["data"]
};

export default withBundleAnalyzer(nextConfig);
