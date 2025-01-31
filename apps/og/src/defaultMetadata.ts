import { APP_NAME, DEFAULT_OG, DESCRIPTION } from "@hey/data/constants";
import type { Metadata } from "next";

const defaultMetadata: Metadata = {
  alternates: { canonical: "https://hey.xyz" },
  applicationName: APP_NAME,
  description: DESCRIPTION,
  keywords: [
    "hey",
    "hey.xyz",
    "social media",
    "lenster",
    "zksync",
    "lens",
    "lens protocol",
    "decentralized",
    "web3"
  ],
  metadataBase: new URL("https://hey.xyz"),
  openGraph: {
    images: [DEFAULT_OG],
    siteName: "Hey",
    type: "website"
  },
  title: APP_NAME,
  twitter: { card: "summary_large_image", site: "@heydotxyz" }
};

export default defaultMetadata;
