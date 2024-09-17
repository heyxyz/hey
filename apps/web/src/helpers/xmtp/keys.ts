import type { Address } from "viem";

// Create a client using keys returned from getKeys
const ENCODING = "binary";

export const getEnv = (): "dev" | "local" | "production" => {
  return "production";
};

export const buildLocalStorageKey = (walletAddress: Address) =>
  walletAddress ? `xmtp:${getEnv()}:keys:${walletAddress}` : "";

export const loadKeys = (walletAddress: Address): null | Uint8Array => {
  const val = localStorage.getItem(buildLocalStorageKey(walletAddress));
  return val ? Buffer.from(val, ENCODING) : null;
};

export const storeKeys = (walletAddress: Address, keys: Uint8Array) => {
  localStorage.setItem(
    buildLocalStorageKey(walletAddress),
    Buffer.from(keys).toString(ENCODING)
  );
};
