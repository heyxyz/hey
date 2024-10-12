import { faker } from "@faker-js/faker";
import { TEST_LENS_ID } from "@hey/data/constants";
import prisma from "@hey/db/prisma/db/client";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("POST /email/update", () => {
  test("should return 400 if body is missing", async () => {
    try {
      await axios.post(
        `${TEST_URL}/email/update`,
        {},
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 400 for invalid email", async () => {
    try {
      await axios.post(
        `${TEST_URL}/email/update`,
        { email: "gm@mail3.me" },
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 and send verification email", async () => {
    const { data, status } = await axios.post(
      `${TEST_URL}/email/update`,
      { email: faker.internet.email() },
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.success).toBe(true);
  });

  test("should return 200 and do nothing if email already exists", async () => {
    const email = faker.internet.email();
    try {
      await prisma.email.create({
        data: { email, id: TEST_LENS_ID }
      });
    } catch {}

    const { data, status } = await axios.post(
      `${TEST_URL}/email/update`,
      { email, resend: false },
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.success).toBe(true);
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.post(`${TEST_URL}/email/update`, {
        email: faker.internet.email()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
