import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("GET /analytics/impressions", () => {
  test("should return 200 and valid analytics data", async () => {
    const { data, status } = await axios.get(
      `${TEST_URL}/analytics/impressions`,
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.result).toBeInstanceOf(Array);
    for (const item of data.result) {
      expect(item).toHaveProperty("date");
      expect(item).toHaveProperty("impressions");
    }
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/analytics/impressions`);
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
