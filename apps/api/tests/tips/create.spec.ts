import crypto from "node:crypto";

import { faker } from "@faker-js/faker";
import prisma from "@hey/db/prisma/db/client";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("POST /tips/create", () => {
  test("should return 200 and create a new tip", async () => {
    const payload = {
      amount: faker.number.int({ min: 1, max: 100 }),
      fromAddress: faker.finance.ethereumAddress(),
      id: "0x1234-0x5678",
      toAddress: faker.finance.ethereumAddress(),
      tokenAddress: faker.finance.ethereumAddress(),
      txHash: `0x${crypto.randomBytes(32).toString("hex")}`
    };

    const { data, status } = await axios.post(
      `${TEST_URL}/tips/create`,
      payload,
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.result).toBeDefined();
    expect(data.result.fromAddress).toBe(payload.fromAddress);
    expect(data.result.toAddress).toBe(payload.toAddress);
    expect(data.result.amount).toBe(payload.amount);
    expect(data.result.txHash).toBe(payload.txHash);

    await prisma.tip.delete({ where: { id: data.result.id } });
  });

  test("should return 400 for invalid Ethereum address", async () => {
    const invalidTip = {
      amount: 50,
      fromAddress: "invalid_address",
      id: "0x1234-0x5678",
      toAddress: "invalid_address",
      tokenAddress: "invalid_address",
      txHash: "invalid_txHash"
    };

    try {
      await axios.post(`${TEST_URL}/tips/create`, invalidTip, {
        headers: getTestAuthHeaders()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 400 if request body is missing", async () => {
    try {
      await axios.post(
        `${TEST_URL}/tips/create`,
        {},
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.post(`${TEST_URL}/tips/create`, {
        amount: 50,
        fromAddress: faker.finance.ethereumAddress(),
        id: "0x1234-0x5678",
        toAddress: faker.finance.ethereumAddress(),
        tokenAddress: faker.finance.ethereumAddress(),
        txHash: faker.finance.ethereumAddress()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
