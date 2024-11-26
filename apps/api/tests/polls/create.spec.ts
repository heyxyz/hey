import { faker } from "@faker-js/faker";
import prisma from "@hey/db/prisma/db/client";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("POST /polls/create", () => {
  test("should return 400 if body is missing", async () => {
    try {
      await axios.post(
        `${TEST_URL}/polls/create`,
        {},
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 400 for invalid poll length", async () => {
    try {
      await axios.post(
        `${TEST_URL}/polls/create`,
        { length: 31, options: ["Option 1", "Option 2"] },
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.error).toBe(
        "Poll length should be between 1 and 30 days."
      );
    }
  });

  test("should return 400 for missing options", async () => {
    try {
      await axios.post(
        `${TEST_URL}/polls/create`,
        { length: 5, options: [] },
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should create a poll and return 200", async () => {
    const options = [faker.lorem.word(), faker.lorem.word()];

    const { data, status } = await axios.post(
      `${TEST_URL}/polls/create`,
      { length: 5, options },
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.result).toBeDefined();
    expect(data.result.id).toBeDefined();
    expect(data.result.options).toBeInstanceOf(Array);
    expect(data.result.options).toHaveLength(options.length);

    const poll = await prisma.poll.findUnique({
      where: { id: data.result.id },
      include: { options: true }
    });
    expect(poll).not.toBeNull();
    expect(poll?.options).toHaveLength(options.length);
  });

  test("should return 401 if the id token is missing", async () => {
    try {
      await axios.post(`${TEST_URL}/polls/create`, {
        length: 5,
        options: ["Option 1", "Option 2"]
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
