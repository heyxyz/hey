import { faker } from "@faker-js/faker";
import prisma from "@hey/db/prisma/db/client";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("GET /email/verify", () => {
  test("should return 400 if token is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/email/verify`, {
        headers: getTestAuthHeaders()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should verify email and redirect if token is valid", async () => {
    const email = faker.internet.email();
    const token = faker.string.uuid();
    const id = faker.string.uuid();

    await prisma.email.create({
      data: {
        id,
        email,
        verificationToken: token,
        verified: false,
        tokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });

    const { status, headers } = await axios.get(`${TEST_URL}/email/verify`, {
      params: { token },
      maxRedirects: 0,
      validateStatus: (status) => status === 302
    });

    expect(status).toBe(302);
    expect(headers.location).toBe("https://hey.xyz");

    const updatedEmail = await prisma.email.findUnique({ where: { email } });
    expect(updatedEmail?.verified).toBe(true);
    expect(updatedEmail?.verificationToken).toBeNull();
    expect(updatedEmail?.tokenExpiresAt).toBeNull();
  });

  test("should return 400 for an invalid or expired token", async () => {
    try {
      await axios.get(`${TEST_URL}/email/verify`, {
        params: { token: "invalidToken" }
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toBe("Something went wrong");
    }
  });
});
