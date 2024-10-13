import { faker } from "@faker-js/faker";
import { PermissionId } from "@hey/data/permissions";
import prisma from "@hey/db/prisma/db/client";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { beforeAll, describe, expect, test } from "vitest";

describe("POST /internal/creator-tools/assign", () => {
  let profileId: string;
  const permissionId = PermissionId.Beta;

  beforeAll(async () => {
    profileId = faker.string.uuid();
  });

  test("should enable permission for a profile", async () => {
    const { data, status } = await axios.post(
      `${TEST_URL}/internal/creator-tools/assign`,
      { enabled: true, id: permissionId, profile_id: profileId },
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.enabled).toBe(true);

    const permission = await prisma.profilePermission.findFirst({
      where: { profileId, permissionId }
    });
    expect(permission).toBeDefined();
  });

  test("should disable permission for a profile", async () => {
    const { data, status } = await axios.post(
      `${TEST_URL}/internal/creator-tools/assign`,
      { enabled: false, id: permissionId, profile_id: profileId },
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.enabled).toBe(false);

    const permission = await prisma.profilePermission.findFirst({
      where: { profileId, permissionId }
    });
    expect(permission).toBeNull();
  });

  test("should return 400 for invalid body", async () => {
    try {
      await axios.post(
        `${TEST_URL}/internal/creator-tools/assign`,
        {},
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 401 if the user doesn't have creator tools access", async () => {
    try {
      await axios.post(
        `${TEST_URL}/internal/creator-tools/assign`,
        {
          enabled: true,
          id: faker.string.uuid(),
          profile_id: faker.string.uuid()
        },
        { headers: getTestAuthHeaders("suspended") }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.post(`${TEST_URL}/internal/creator-tools/assign`, {
        enabled: true,
        id: faker.string.uuid(),
        profile_id: faker.string.uuid()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
