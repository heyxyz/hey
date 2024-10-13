import { faker } from "@faker-js/faker";
import { TEST_LENS_ID } from "@hey/data/constants";
import { Permission, PermissionId } from "@hey/data/permissions";
import prisma from "@hey/db/prisma/db/client";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("GET /internal/profile/get", () => {
  test("should return 200 and the internal profile data", async () => {
    const preference = await prisma.preference.create({
      data: {
        id: faker.string.uuid(),
        appIcon: 1,
        highSignalNotificationFilter: true
      }
    });

    const [email] = await Promise.all([
      prisma.email.create({
        data: {
          id: preference.id,
          email: faker.internet.email(),
          verified: true
        }
      }),
      prisma.profilePermission.create({
        data: { profileId: preference.id, permissionId: PermissionId.Beta }
      }),
      prisma.membershipNft.create({
        data: { id: preference.id, dismissedOrMinted: true }
      })
    ]);

    const { data, status } = await axios.get(
      `${TEST_URL}/internal/profile/get`,
      { params: { id: preference.id }, headers: getTestAuthHeaders() }
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
  });

  test("should return 400 if id is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/internal/profile/get`, {
        headers: getTestAuthHeaders()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/internal/profile/get`, {
        params: { id: TEST_LENS_ID }
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
