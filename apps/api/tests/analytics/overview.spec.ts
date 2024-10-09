import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("GET /analytics/overview", () => {
  test("should return 200 and valid analytics overview data", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/analytics/overview`, {
      headers: getTestAuthHeaders()
    });

    expect(status).toBe(200);
    expect(data.result).toBeInstanceOf(Array);
    for (const item of data.result) {
      expect(item).toHaveProperty("date");
      expect(item).toHaveProperty("likes");
      expect(item).toHaveProperty("comments");
      expect(item).toHaveProperty("collects");
      expect(item).toHaveProperty("mirrors");
      expect(item).toHaveProperty("quotes");
      expect(item).toHaveProperty("mentions");
      expect(item).toHaveProperty("follows");
      expect(item).toHaveProperty("bookmarks");
    }
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/analytics/overview`);
    } catch (error: any) {
      expect(error.response.status).toBe(401); // Expect 401 Unauthorized if no identity token is provided
    }
  });
});
