import { TEST_LENS_ID } from "@hey/data/constants";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("GET /internal/leafwatch/profile/details", () => {
  test("should return 200 and profile details", async () => {
    const { data, status } = await axios.get(
      `${TEST_URL}/internal/leafwatch/profile/details`,
      { params: { id: TEST_LENS_ID }, headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.result).toBeDefined();
    expect(data.result.actor).toBe(TEST_LENS_ID);
    expect(data.result.browser).toStrictEqual(expect.any(String));
    expect(data.result.city).toStrictEqual(expect.any(String));
    expect(data.result.country).toStrictEqual(expect.any(String));
    expect(data.result.events).toStrictEqual(expect.any(Number));
  });

  test("should return 400 if id is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/internal/leafwatch/profile/details`, {
        headers: getTestAuthHeaders()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/internal/leafwatch/profile/details`, {
        params: { id: TEST_LENS_ID }
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });

  test("should return 401 if the user is not staff", async () => {
    try {
      await axios.get(`${TEST_URL}/internal/leafwatch/profile/details`, {
        params: { id: TEST_LENS_ID },
        headers: getTestAuthHeaders()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
