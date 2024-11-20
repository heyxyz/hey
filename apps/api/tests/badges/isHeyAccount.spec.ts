import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import { describe, expect, test } from "vitest";

describe("GET /badges/isHeyAccount", () => {
  test("should return 400 if no id or address is provided", async () => {
    try {
      await axios.get(`${TEST_URL}/badges/isHeyAccount`);
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 and confirm profile badge ownership with id", async () => {
    const { data, status } = await axios.get(
      `${TEST_URL}/badges/isHeyAccount`,
      { params: { id: "0x0415da" } }
    );

    expect(status).toBe(200);
    expect(data.isHeyAccount).toBe(true);
  });

  test("should return 200 and confirm profile badge ownership with address", async () => {
    const { data, status } = await axios.get(
      `${TEST_URL}/badges/isHeyAccount`,
      { params: { address: "0x0Cfc642C90ED27be228E504307049230545b2981" } }
    );

    expect(status).toBe(200);
    expect(data.isHeyAccount).toBe(true);
  });

  test("should return 200 and no badge ownership when profile doesn't have it", async () => {
    const { data, status } = await axios.get(
      `${TEST_URL}/badges/isHeyAccount`,
      { params: { id: "0x0d" } }
    );

    expect(status).toBe(200);
    expect(data.isHeyAccount).toBe(false);
  });

  test("should return 200 and no badge ownership when address doesn't have it", async () => {
    const { data, status } = await axios.get(
      `${TEST_URL}/badges/isHeyAccount`,
      { params: { address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" } }
    );

    expect(status).toBe(200);
    expect(data.isHeyAccount).toBe(false);
  });
});
