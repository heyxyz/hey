import axios from "axios";
import { describe, expect, test } from "vitest";
import { TEST_URL } from "../helpers/constants";

describe("POST /ens", () => {
  test("should return 400 if no body is provided", async () => {
    try {
      await axios.post(`${TEST_URL}/ens`, {});
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 400 for invalid addresses", async () => {
    try {
      await axios.post(`${TEST_URL}/ens`, {
        addresses: ["invalid-address"]
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 and valid ENS names for correct addresses", async () => {
    const { data, status } = await axios.post(`${TEST_URL}/ens`, {
      addresses: ["0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF"]
    });

    expect(status).toBe(200);
    expect(data.result).toEqual(["yoginth.com"]);
  });

  test("should return 400 for too many addresses", async () => {
    const addresses = new Array(101).fill(
      "0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF"
    );

    try {
      await axios.post(`${TEST_URL}/ens`, { addresses });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 400 for invalid ethereum addresse", async () => {
    try {
      await axios.post(`${TEST_URL}/ens`, { addresses: ["0xinvalid"] });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });
});
