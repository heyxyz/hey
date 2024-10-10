import { faker } from "@faker-js/faker";
import prisma from "@hey/db/prisma/db/client";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("POST /internal/tokens/delete", () => {
  test("should return 400 if body is missing", async () => {
    try {
      await axios.post(
        `${TEST_URL}/internal/tokens/delete`,
        {},
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 400 for invalid body", async () => {
    try {
      await axios.post(
        `${TEST_URL}/internal/tokens/delete`,
        { randomField: "invalid" },
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 and delete the token", async () => {
    const contractAddress = faker.finance.ethereumAddress();
    const name = faker.commerce.productName();
    const symbol = faker.commerce.productAdjective();

    const { id } = await prisma.allowedToken.create({
      data: { name, symbol, contractAddress }
    });

    const { data, status } = await axios.post(
      `${TEST_URL}/internal/tokens/delete`,
      { id },
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.success).toBe(true);
  });

  test("should return 401 if the user is not staff", async () => {
    try {
      await axios.post(
        `${TEST_URL}/internal/tokens/delete`,
        { id: "validTokenId" },
        { headers: getTestAuthHeaders("suspended") }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
