import prisma from "@hey/db/prisma/db/client";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { beforeAll, describe, expect, test } from "vitest";

describe("POST /tips/get", () => {
  const fakePublicationIds = ["0x0d-0x01", "0x0d-0x02", "0x0d-0x03"];

  beforeAll(async () => {
    await prisma.tip.createMany({
      data: fakePublicationIds.map((id, index) => ({
        amount: 100 + index * 10,
        fromProfileId: "0xTestProfile",
        publicationId: id,
        toProfileId: "0xTestProfileTo",
        fromAddress: "0xFromAddress",
        toAddress: "0xToAddress",
        tokenAddress: "0xTokenAddress",
        txHash: "0xTransactionHash"
      }))
    });
  });

  test("should return 200 and fetch tip data for publications", async () => {
    const { data, status } = await axios.post(
      `${TEST_URL}/tips/get`,
      { ids: fakePublicationIds },
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.result).toBeInstanceOf(Array);
    expect(data.result).toHaveLength(fakePublicationIds.length);

    data.result.forEach((tipResult: any, index: number) => {
      expect(tipResult.id).toBe(fakePublicationIds[index]);
      expect(tipResult.count).toBeDefined();
      expect(tipResult.tipped).toBe(false);
    });
  });

  test("should return 400 if no ids are provided", async () => {
    try {
      await axios.post(
        `${TEST_URL}/tips/get`,
        { ids: [] },
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.post(`${TEST_URL}/tips/get`, { ids: fakePublicationIds });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
