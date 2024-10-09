import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import { describe, expect, test } from "vitest";

describe("GET /badges/hasHeyNft", () => {
  test("should return 400 if no id or address is provided", async () => {
    try {
      await axios.get(`${TEST_URL}/badges/hasHeyNft`);
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 and confirm NFT ownership with id", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/badges/hasHeyNft`, {
      params: { id: "0x0d" }
    });

    expect(status).toBe(200);
    expect(data.hasHeyNft).toBe(true);
  });

  test("should return 200 and confirm NFT ownership with address", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/badges/hasHeyNft`, {
      params: { address: "0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF" }
    });

    expect(status).toBe(200);
    expect(data.hasHeyNft).toBe(true);
  });

  test("should return 200 and no NFT ownership when profile or address doesn't have it", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/badges/hasHeyNft`, {
      params: { id: "0x01" }
    });

    expect(status).toBe(200);
    expect(data.hasHeyNft).toBe(false);
  });
});
