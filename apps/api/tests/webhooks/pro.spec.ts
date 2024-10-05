import prisma from "@hey/db/prisma/db/client";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import { describe, expect, test } from "vitest";

describe("POST /webhooks/pro", () => {
  test("should return 400 if no body is provided", async () => {
    try {
      await axios.post(
        `${TEST_URL}/webhooks/pro?secret=${process.env.SECRET}`,
        {}
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 and update pro status for valid request", async () => {
    // Delete all pro before each test
    await prisma.pro.deleteMany();

    const hash =
      "0xb2c82c68d396586991d616fec2c28c283917d3f2b73311cd1b337773838d31e9";

    const { data, status } = await axios.post(
      `${TEST_URL}/webhooks/pro?secret=${process.env.SECRET}`,
      { event: { activity: [{ hash }] } }
    );

    const pro = await prisma.pro.findFirst({
      where: { transactionHash: hash }
    });

    expect(status).toBe(200);
    expect(data.result).toBeDefined();
    expect(pro?.transactionHash).toBe(hash);
    expect(pro?.amount).toBe(13.16);
    expect(pro?.profileId).toBe("0x0d");
  });
});
