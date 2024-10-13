import { TEST_LENS_ID } from "@hey/data/constants";
import { PermissionId } from "@hey/data/permissions";
import prisma from "@hey/db/prisma/db/client";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("POST /internal/permissions/assign", () => {
  test("should return 200 and enable the permission", async () => {
    const { data, status } = await axios.post(
      `${TEST_URL}/internal/permissions/assign`,
      { profile_id: TEST_LENS_ID, id: PermissionId.Beta, enabled: true },
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.enabled).toBe(true);

    const permission = await prisma.profilePermission.findFirst({
      where: { profileId: TEST_LENS_ID, permissionId: PermissionId.Beta }
    });
    expect(permission?.permissionId).toBe(PermissionId.Beta);
  });

  test("should return 200 and disable the permission", async () => {
    const { data, status } = await axios.post(
      `${TEST_URL}/internal/permissions/assign`,
      { profile_id: TEST_LENS_ID, id: PermissionId.Beta, enabled: false },
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.enabled).toBe(false);

    const permission = await prisma.profilePermission.findFirst({
      where: { profileId: TEST_LENS_ID, permissionId: PermissionId.Beta }
    });
    expect(permission).toBeNull();
  });

  test("should return 400 if body is missing", async () => {
    try {
      await axios.post(
        `${TEST_URL}/internal/permissions/assign`,
        {},
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 401 if the user is not staff", async () => {
    try {
      await axios.post(
        `${TEST_URL}/internal/permissions/assign`,
        { profile_id: TEST_LENS_ID, id: PermissionId.Beta, enabled: true },
        { headers: getTestAuthHeaders("suspended") }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.post(`${TEST_URL}/internal/permissions/assign`);
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
