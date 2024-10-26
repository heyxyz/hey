import { faker } from "@faker-js/faker";
import { TEST_LENS_ID } from "@hey/data/constants";
import prisma from "@hey/db/prisma/db/client";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("GET /lists/get", () => {
  test("should return 400 if no id is provided", async () => {
    try {
      await axios.get(`${TEST_URL}/lists/get`, {
        headers: getTestAuthHeaders()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 with a list", async () => {
    const newList = await prisma.list.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        avatar: faker.image.url(),
        createdBy: TEST_LENS_ID
      }
    });

    const { data, status } = await axios.get(`${TEST_URL}/lists/get`, {
      params: { id: newList.id }
    });

    expect(status).toBe(200);
    expect(data.result).toBeDefined();
    expect(data.result.name).toBe(newList.name);
    expect(data.result.description).toBe(newList.description);
    expect(data.result.avatar).toBe(newList.avatar);
    expect(data.result.totalPins).toStrictEqual(expect.any(Number));
    expect(data.result.totalProfiles).toStrictEqual(expect.any(Number));
  });
});
