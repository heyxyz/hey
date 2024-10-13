import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("GET /internal/leafwatch/stats", () => {
  test("should return 200 and valid stats", async () => {
    const { data, status } = await axios.get(
      `${TEST_URL}/internal/leafwatch/stats`,
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data).toBeDefined();

    expect(data.dau).toBeInstanceOf(Array);
    expect(data.dau[0]).toHaveProperty("date", expect.any(String));
    expect(data.dau[0]).toHaveProperty("dau", expect.any(String));
    expect(data.dau[0]).toHaveProperty("events", expect.any(String));
    expect(data.dau[0]).toHaveProperty("impressions", expect.any(String));

    expect(data.events).toHaveProperty("last_1_hour", expect.any(String));
    expect(data.events).toHaveProperty("today", expect.any(String));
    expect(data.impressions).toHaveProperty("last_1_hour", expect.any(String));
    expect(data.impressions).toHaveProperty("today", expect.any(String));

    expect(data.referrers).toBeInstanceOf(Array);
    expect(data.referrers[0]).toHaveProperty("referrer", expect.any(String));
    expect(data.referrers[0]).toHaveProperty("count", expect.any(String));
  });

  test("should return 401 if the user is not staff", async () => {
    try {
      await axios.get(`${TEST_URL}/internal/leafwatch/stats`, {
        headers: getTestAuthHeaders("suspended")
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/internal/leafwatch/stats`);
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
