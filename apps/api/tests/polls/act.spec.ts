import { faker } from "@faker-js/faker";
import prisma from "@hey/db/prisma/db/client";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

describe("POST /polls/act", () => {
  let testPollId: string;
  let testOptionId: string;

  beforeAll(async () => {
    const poll = await prisma.poll.create({
      data: {
        endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        options: {
          createMany: {
            data: [
              { option: faker.lorem.word(), index: 0 },
              { option: faker.lorem.word(), index: 1 }
            ]
          }
        }
      },
      include: { options: true }
    });
    testPollId = poll.id;
    testOptionId = poll.options[0].id;
  });

  test("should return 400 if body is missing", async () => {
    try {
      await axios.post(
        `${TEST_URL}/polls/act`,
        {},
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 400 if the poll has expired", async () => {
    const expiredPoll = await prisma.poll.create({
      data: {
        endsAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        options: {
          createMany: {
            data: [
              { option: faker.lorem.word(), index: 0 },
              { option: faker.lorem.word(), index: 1 }
            ]
          }
        }
      },
      include: { options: true }
    });

    try {
      await axios.post(
        `${TEST_URL}/polls/act`,
        { poll: expiredPoll.id, option: expiredPoll.options[0].id },
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.error).toBe("Poll expired.");
    }
  });

  test("should allow voting in an active poll and return 200", async () => {
    const { data, status } = await axios.post(
      `${TEST_URL}/polls/act`,
      { poll: testPollId, option: testOptionId },
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.id).toBeDefined();
    expect(data.success).toBe(true);

    const pollResponse = await prisma.pollResponse.findFirst({
      where: { optionId: testOptionId }
    });
    expect(pollResponse).not.toBeNull();
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.post(`${TEST_URL}/polls/act`, {
        poll: testPollId,
        option: testOptionId
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });

  test("should delete existing response and allow revote", async () => {
    await axios.post(
      `${TEST_URL}/polls/act`,
      { poll: testPollId, option: testOptionId },
      { headers: getTestAuthHeaders() }
    );

    const newOptionId = (
      await prisma.pollOption.findFirst({
        where: { pollId: testPollId, index: 1 }
      })
    )?.id;

    const { data, status } = await axios.post(
      `${TEST_URL}/polls/act`,
      { poll: testPollId, option: newOptionId },
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.id).toBeDefined();
    expect(data.success).toBe(true);

    const pollResponses = await prisma.pollResponse.findMany({
      where: { option: { pollId: testPollId } }
    });
    expect(pollResponses).toHaveLength(1);
    expect(pollResponses[0]?.optionId).toBe(newOptionId);
  });

  afterAll(async () => {
    await prisma.pollResponse.deleteMany({});
    await prisma.pollOption.deleteMany({ where: { pollId: testPollId } });
    await prisma.poll.delete({ where: { id: testPollId } });
  });
});
