import bundleAnalyzer from "@next/bundle-analyzer";
import { withAxiom } from "next-axiom";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true"
});

const allowedBots =
  ".*(bot|telegram|baidu|bing|yandex|iframely|whatsapp|facebook).*";
const { VERCEL_DEPLOYMENT_ID } = process.env;
const DEPLOYMENT_ID = VERCEL_DEPLOYMENT_ID || "unknown";

// Remove data-testid from production
const isDevelopment = process.env.NODE_ENV === "development";
const compilerOptions = isDevelopment
  ? {}
  : { compiler: { reactRemoveProperties: { properties: ["^data-testid$"] } } };

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...compilerOptions,
  headers() {
    return [
      {
        headers: [
          { key: "Referrer-Policy", value: "strict-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "X-Hey-Deployment", value: DEPLOYMENT_ID }
        ],
        source: "/(.*)"
      }
    ];
  },
  poweredByHeader: false,
  productionBrowserSourceMaps: true,
  reactStrictMode: false,
  redirects() {
    return [
      {
        destination: "/?signup=true",
        permanent: false,
        source: "/signup"
      },
      {
        destination: "https://discord.com/invite/B8eKhSSUwX",
        permanent: true,
        source: "/discord"
      },
      {
        destination:
          "https://zora.co/collect/zora:0xf2086c0eaa8b34b0eef73920d0b1b53f4146e2e4/1?referrer=0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF",
        permanent: true,
        source: "/zorb"
      },
      {
        destination:
          "https://explorer.gitcoin.co/#/round/42161/608/6?utm_source=hey.xyz",
        permanent: true,
        source: "/gitcoin"
      },
      // Redirect: hey.xyz/u/lens/<localname> > hey.xyz/u/<localname>
      {
        destination: "/u/:handle",
        permanent: true,
        source: "/u/:namespace/:handle"
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

export default withBundleAnalyzer(withAxiom(nextConfig));
