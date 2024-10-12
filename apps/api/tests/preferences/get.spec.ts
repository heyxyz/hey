import { faker } from "@faker-js/faker";
import { TEST_LENS_ID } from "@hey/data/constants";
import prisma from "@hey/db/prisma/db/client";
import { delRedis } from "@hey/db/redisClient";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { beforeAll, describe, expect, test } from "vitest";

describe("GET /preferences/get", () => {
  let testEmail: string;
  let testPermissionKey: string;

  beforeAll(async () => {
    testEmail = faker.internet.email();
    testPermissionKey = faker.string.uuid();

    const [, , , permission] = await Promise.all([
      prisma.preference.upsert({
        where: { id: TEST_LENS_ID },
        update: { appIcon: 2, highSignalNotificationFilter: true },
        create: {
          id: TEST_LENS_ID,
          appIcon: 2,
          highSignalNotificationFilter: true
        }
      }),
      prisma.email.upsert({
        where: { id: TEST_LENS_ID },
        update: { email: testEmail, verified: true },
        create: { id: TEST_LENS_ID, email: testEmail, verified: true }
      }),
      prisma.membershipNft.upsert({
        where: { id: TEST_LENS_ID },
        update: { dismissedOrMinted: true },
        create: { id: TEST_LENS_ID, dismissedOrMinted: true }
      }),
      prisma.permission.create({ data: { key: testPermissionKey } })
    ]);

    await prisma.profilePermission.create({
      data: { profileId: TEST_LENS_ID, permissionId: permission.id }
    });
  });

  test("should return 200 and profile preferences", async () => {
    await delRedis(`preference:${TEST_LENS_ID}`);

    const { data, status } = await axios.get(`${TEST_URL}/preferences/get`, {
      headers: getTestAuthHeaders()
    });

    expect(status).toBe(200);
    expect(data.result).toBeDefined();
    expect(data.result.email).toBe(testEmail);
    expect(data.result.emailVerified).toBe(true);
    expect(data.result.appIcon).toBe(2);
    expect(data.result.permissions).toContain(testPermissionKey);
    expect(data.result.hasDismissedOrMintedMembershipNft).toBe(true);
    expect(data.result.highSignalNotificationFilter).toBe(true);
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/preferences/get`);
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
