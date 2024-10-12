import { faker } from "@faker-js/faker";
import prisma from "@hey/db/prisma/db/client";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

describe("GET /polls/get", () => {
  let testPollId: string;

  beforeAll(async () => {
    const poll = await prisma.poll.create({
      data: {
        endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        options: {
          createMany: {
            data: [
              { option: "Option 1", index: 0 },
              { option: "Option 2", index: 1 }
            ]
          }
        }
      },
      include: { options: true }
    });
    testPollId = poll.id;
  });

  test("should return 400 if poll id is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/polls/get`, {
        headers: getTestAuthHeaders()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 400 for non-existent poll", async () => {
    try {
      await axios.get(`${TEST_URL}/polls/get`, {
        headers: getTestAuthHeaders(),
        params: { id: faker.string.uuid() }
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.error).toBe("Poll not found.");
    }
  });

  test("should return poll data for a valid poll id", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/polls/get`, {
      headers: getTestAuthHeaders(),
      params: { id: testPollId }
    });

    expect(status).toBe(200);
    expect(data.result).toBeDefined();
    expect(data.result.id).toBe(testPollId);
    expect(data.result.options).toHaveLength(2);
    expect(data.result.options[0].option).toBe("Option 1");

    expect(data.result.options[0]).toHaveProperty("id");
    expect(data.result.options[0]).toHaveProperty("option");
    expect(data.result.options[0]).toHaveProperty("percentage");
    expect(data.result.options[0]).toHaveProperty("responses");
    expect(data.result.options[0]).toHaveProperty("voted");
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/polls/get`, {
        params: { id: testPollId },
        headers: {}
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });

  afterAll(async () => {
    await prisma.pollOption.deleteMany({ where: { pollId: testPollId } });
    await prisma.poll.delete({ where: { id: testPollId } });
  });
});
