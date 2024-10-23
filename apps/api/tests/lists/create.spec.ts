import { faker } from "@faker-js/faker";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("POST /lists/create", () => {
  test("should return 400 if body is missing", async () => {
    try {
      await axios.post(
        `${TEST_URL}/lists/create`,
        {},
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 400 for no name", async () => {
    try {
      await axios.post(
        `${TEST_URL}/lists/create`,
        { description: faker.lorem.sentence(), avatar: faker.image.url() },
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 and create a new list", async () => {
    const name = faker.commerce.productName();
    const description = faker.lorem.sentence();
    const avatar = faker.image.url();

    const { data, status } = await axios.post(
      `${TEST_URL}/lists/create`,
      { name, description, avatar },
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.result).toBeDefined();
    expect(data.result.name).toBe(name);
    expect(data.result.description).toBe(description);
    expect(data.result.avatar).toBe(avatar);
  });

  test("should return 401 if the user is not staff", async () => {
    try {
      await axios.post(
        `${TEST_URL}/internal/tokens/create`,
        {
          contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
          decimals: 18,
          name: "Test Token",
          symbol: "TT"
        },
        { headers: getTestAuthHeaders("suspended") }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.post(`${TEST_URL}/lists/create`, {
        name: faker.commerce.productName(),
        description: faker.lorem.sentence(),
        avatar: faker.image.url()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
