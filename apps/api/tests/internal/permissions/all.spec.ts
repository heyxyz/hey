import { faker } from "@faker-js/faker";
import prisma from "@hey/db/prisma/db/client";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { beforeAll, describe, expect, test } from "vitest";

describe("GET /internal/permissions/all", () => {
  let testPermissionKeys: string[];

  beforeAll(async () => {
    testPermissionKeys = [
      faker.string.uuid(),
      faker.string.uuid(),
      faker.string.uuid()
    ];

    await prisma.permission.createMany({
      data: testPermissionKeys.map((key) => ({ key, type: "PERMISSION" }))
    });
  });

  test("should return 200 and list all permissions", async () => {
    const { data, status } = await axios.get(
      `${TEST_URL}/internal/permissions/all`,
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.permissions).toBeDefined();
    expect(data.permissions).toBeInstanceOf(Array);

    const permissionKeys = data.permissions.map((p: any) => p.key);
    for (const key of testPermissionKeys) {
      expect(permissionKeys).toContain(key);
    }
  });

  test("should return 401 if the user is not staff", async () => {
    try {
      await axios.get(`${TEST_URL}/internal/permissions/all`, {
        headers: getTestAuthHeaders("suspended")
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/internal/permissions/all`);
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
