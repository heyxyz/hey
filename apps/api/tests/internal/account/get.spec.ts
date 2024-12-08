import { faker } from "@faker-js/faker";
import { TEST_LENS_ID } from "@hey/data/constants";
import { Permission, PermissionId } from "@hey/data/permissions";
import prisma from "@hey/db/prisma/db/client";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("GET /internal/account/get", () => {
  test("should return 200 and the internal account data", async () => {
    const preference = await prisma.preference.create({
      data: {
        accountAddress: faker.string.uuid(),
        appIcon: 1,
        highSignalNotificationFilter: true,
        developerMode: true
      }
    });

    const [email] = await Promise.all([
      prisma.email.create({
        data: {
          accountAddress: preference.accountAddress,
          email: faker.internet.email(),
          verified: true
        }
      }),
      prisma.accountPermission.create({
        data: {
          accountAddress: preference.accountAddress,
          permissionId: PermissionId.Beta
        }
      }),
      prisma.membershipNft.create({
        data: {
          accountAddress: preference.accountAddress,
          dismissedOrMinted: true
        }
      })
    ]);

    const { data, status } = await axios.get(
      `${TEST_URL}/internal/account/get`,
      {
        params: { address: preference.accountAddress },
        headers: getTestAuthHeaders()
      }
    );

    expect(status).toBe(200);
    expect(data.result).toBeDefined();
    expect(data.result.email).toBe(email.email);
    expect(data.result.emailVerified).toBe(email.verified);
    expect(data.result.appIcon).toBe(preference.appIcon);
    expect(data.result.permissions).toContain(Permission.Beta);
    expect(data.result.hasDismissedOrMintedMembershipNft).toBe(true);
    expect(data.result.highSignalNotificationFilter).toBe(
      preference.highSignalNotificationFilter
    );
    expect(data.result.developerMode).toBe(preference.developerMode);
  });

  test("should return 400 if id is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/internal/account/get`, {
        headers: getTestAuthHeaders()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 401 if the id token is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/internal/account/get`, {
        params: { id: TEST_LENS_ID }
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
