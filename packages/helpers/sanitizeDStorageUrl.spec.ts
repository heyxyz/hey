import { ARWEAVE_GATEWAY, IPFS_GATEWAY } from "@hey/data/constants";
import { describe, expect, test } from "vitest";

import sanitizeDStorageUrl from "./sanitizeDStorageUrl";

describe("getIPFSLink", () => {
  test("should return empty string when input hash is falsy", () => {
    expect(sanitizeDStorageUrl("")).toBe("");
  });

  test("should return ipfs gateway link when cidV0 is found", () => {
    const cidV0 = sanitizeDStorageUrl(
      "ipfs://QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR"
    );
    expect(cidV0).toBe(
      `${IPFS_GATEWAY}/QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR`
    );
  });

  test("should return ipfs gateway link when cidV1 is found", () => {
    const cidV1 = sanitizeDStorageUrl(
      "ipfs://bafkreigtnlyilggrkgpyjbgdzlxmcc4go3364n62uiq577smnnsoczfo6e"
    );
    expect(cidV1).toBe(
      `${IPFS_GATEWAY}/bafkreigtnlyilggrkgpyjbgdzlxmcc4go3364n62uiq577smnnsoczfo6e`
    );
  });

  test("should return ipfs gateway link when doubleIpfs is found", () => {
    const doubleIpfs = sanitizeDStorageUrl(
      "ipfs://ipfs/QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR"
    );
    expect(doubleIpfs).toBe(
      `${IPFS_GATEWAY}/QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR`
    );
  });

  test("should return ipfs gateway link when defaultIpfs is found", () => {
    const defaultIpfs = sanitizeDStorageUrl(
      "https://ipfs.io/ipfs/QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR"
    );
    expect(defaultIpfs).toBe(
      `${IPFS_GATEWAY}/QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR`
    );
  });

  test("should return arweave gateway link when arweave hash is found", () => {
    const arweave = sanitizeDStorageUrl(
      "ar://Xa6qk95912lq3uWMi0V6wxBYQer99q0i7_6iSt1SmHA"
    );

    expect(arweave).toBe(
      `${ARWEAVE_GATEWAY}/Xa6qk95912lq3uWMi0V6wxBYQer99q0i7_6iSt1SmHA`
    );
  });

  test("should return arweave gateway link when arweave link is found", () => {
    const arweave = sanitizeDStorageUrl(
      `${ARWEAVE_GATEWAY}/Xa6qk95912lq3uWMi0V6wxBYQer99q0i7_6iSt1SmHA`
    );

    expect(arweave).toBe(
      `${ARWEAVE_GATEWAY}/Xa6qk95912lq3uWMi0V6wxBYQer99q0i7_6iSt1SmHA`
    );
  });
});
