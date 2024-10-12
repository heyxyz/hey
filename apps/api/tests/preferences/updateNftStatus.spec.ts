import { TEST_LENS_ID } from "@hey/data/constants";
import prisma from "@hey/db/prisma/db/client";
import { delRedis } from "@hey/db/redisClient";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("POST /preferences/updateNftStatus", () => {
  test("should return 200 and update NFT status", async () => {
    await delRedis(`preference:${TEST_LENS_ID}`);

    const { data, status } = await axios.post(
      `${TEST_URL}/preferences/updateNftStatus`,
      {},
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.result).toBeDefined();
    expect(data.result.dismissedOrMinted).toBe(true);

    const updatedEntry = await prisma.membershipNft.findUnique({
      where: { id: TEST_LENS_ID }
    });
    expect(updatedEntry?.dismissedOrMinted).toBe(true);
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.post(`${TEST_URL}/preferences/updateNftStatus`);
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
