import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { describe, expect, test } from "vitest";
import getWalletDetails from "./getWalletDetails";

describe("getWalletDetails", () => {
  test("should return correct details for WalletConnect", () => {
    const walletDetails = getWalletDetails("WalletConnect");
    expect(walletDetails.name).toBe("WalletConnect");
    expect(walletDetails.logo).toBe(
      `${STATIC_IMAGES_URL}/wallets/walletconnect.svg`
    );
  });

  test("should return correct details for Coinbase Wallet", () => {
    const walletDetails = getWalletDetails("Coinbase Wallet");
    expect(walletDetails.name).toBe("Coinbase Wallet");
    expect(walletDetails.logo).toBe(
      `${STATIC_IMAGES_URL}/wallets/coinbase.svg`
    );
  });

  test("should return default details for an unknown wallet", () => {
    const walletDetails = getWalletDetails("SomeOtherWallet");
    expect(walletDetails.name).toBe("SomeOtherWallet");
    expect(walletDetails.logo).toBe(
      `${STATIC_IMAGES_URL}/wallets/browser-wallet.svg`
    );
  });

  test("should handle empty string as input", () => {
    const walletDetails = getWalletDetails("");
    expect(walletDetails.name).toBe("");
    expect(walletDetails.logo).toBe(
      `${STATIC_IMAGES_URL}/wallets/browser-wallet.svg`
    );
  });

  test("should return default details for null input", () => {
    const walletDetails = getWalletDetails(null as any);
    expect(walletDetails.name).toBe(null);
    expect(walletDetails.logo).toBe(
      `${STATIC_IMAGES_URL}/wallets/browser-wallet.svg`
    );
  });

  test("should return default details for undefined input", () => {
    const walletDetails = getWalletDetails(undefined as any);
    expect(walletDetails.name).toBe(undefined);
    expect(walletDetails.logo).toBe(
      `${STATIC_IMAGES_URL}/wallets/browser-wallet.svg`
    );
  });

  test("should return default details for a wallet name with extra spaces", () => {
    const walletDetails = getWalletDetails("  WalletConnect  ".trim());
    expect(walletDetails.name).toBe("WalletConnect");
    expect(walletDetails.logo).toBe(
      `${STATIC_IMAGES_URL}/wallets/walletconnect.svg`
    );
  });

  test("should return correct details for case-insensitive match of Coinbase Wallet", () => {
    const walletDetails = getWalletDetails("coinbase wallet");
    expect(walletDetails.name).toBe("coinbase wallet");
    expect(walletDetails.logo).toBe(
      `${STATIC_IMAGES_URL}/wallets/browser-wallet.svg`
    );
  });
});
