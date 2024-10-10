import { faker } from "@faker-js/faker";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("POST /internal/tokens/create", () => {
  test("should return 400 if body is missing", async () => {
    try {
      await axios.post(
        `${TEST_URL}/internal/tokens/create`,
        {},
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 400 for invalid Ethereum address", async () => {
    try {
      await axios.post(
        `${TEST_URL}/internal/tokens/create`,
        {
          contractAddress: "invalidAddress",
          decimals: 18,
          name: "Test Token",
          symbol: "TT"
        },
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 and create a new token", async () => {
    const contractAddress = faker.finance.ethereumAddress();
    const name = faker.commerce.productName();
    const symbol = faker.commerce.productAdjective();

    const { data, status } = await axios.post(
      `${TEST_URL}/internal/tokens/create`,
      {
        contractAddress,
        decimals: 18,
        name,
        symbol
      },
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.token).toBeDefined();
    expect(data.token.contractAddress).toBe(contractAddress);
    expect(data.token.decimals).toBe(18);
    expect(data.token.name).toBe(name);
    expect(data.token.symbol).toBe(symbol);
  });

  test("should return 401 if the user is not staff", async () => {
    try {
      await axios.post(
        `${TEST_URL}/internal/tokens/create`,
        {
          contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
          decimals: 18,
          name: "Test Token",
          symbol: "TT"
        },
        { headers: getTestAuthHeaders("suspended") }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
