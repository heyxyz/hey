import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { describe, expect, test } from "vitest";

import getNftChainInfo from "./getNftChainInfo";

describe("getNftChainInfo", () => {
  test("should return Ethereum chain info when given chain ethereum", () => {
    const expectedInfo = {
      logo: `${STATIC_IMAGES_URL}/chains/ethereum.svg`,
      name: "Ethereum"
    };

    expect(getNftChainInfo("ethereum")).toEqual(expectedInfo);
  });

  test("should return Goerli chain info when given chain goerli", () => {
    const expectedInfo = {
      logo: `${STATIC_IMAGES_URL}/chains/ethereum.svg`,
      name: "Goerli"
    };

    expect(getNftChainInfo("goerli")).toEqual(expectedInfo);
  });

  test("should return Optimism chain info when given chain optimism", () => {
    const expectedInfo = {
      logo: `${STATIC_IMAGES_URL}/chains/optimism.svg`,
      name: "Optimism"
    };

    expect(getNftChainInfo("optimism")).toEqual(expectedInfo);
  });

  test("should return Optimism Testnet chain info when given chain optimism-testnet", () => {
    const expectedInfo = {
      logo: `${STATIC_IMAGES_URL}/chains/optimism.svg`,
      name: "Optimism Testnet"
    };

    expect(getNftChainInfo("optimism-testnet")).toEqual(expectedInfo);
  });

  test("should return Zora chain info when given chain zora", () => {
    const expectedInfo = {
      logo: `${STATIC_IMAGES_URL}/chains/zora.svg`,
      name: "Zora"
    };

    expect(getNftChainInfo("zora")).toEqual(expectedInfo);
  });

  test("should return Zora Testnet chain info when given chain zora-testnet", () => {
    const expectedInfo = {
      logo: `${STATIC_IMAGES_URL}/chains/zora.svg`,
      name: "Zora Testnet"
    };

    expect(getNftChainInfo("zora-testnet")).toEqual(expectedInfo);
  });

  test("should return Base chain info when given chain base", () => {
    const expectedInfo = {
      logo: `${STATIC_IMAGES_URL}/chains/base.svg`,
      name: "Base"
    };

    expect(getNftChainInfo("base")).toEqual(expectedInfo);
  });

  test("should return Base Testnet chain info when given chain base-testnet", () => {
    const expectedInfo = {
      logo: `${STATIC_IMAGES_URL}/chains/base.svg`,
      name: "Base Testnet"
    };

    expect(getNftChainInfo("base-testnet")).toEqual(expectedInfo);
  });
});
