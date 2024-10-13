import { TEST_LENS_ID } from "@hey/data/constants";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("GET /internal/leafwatch/profile/impressions", () => {
  test("should return 200 and valid impressions data", async () => {
    const { data, status } = await axios.get(
      `${TEST_URL}/internal/leafwatch/profile/impressions`,
      { params: { id: TEST_LENS_ID }, headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.totalImpressions).toStrictEqual(expect.any(Number));
    expect(data.yearlyImpressions).toBeInstanceOf(Array);
    expect(data.yearlyImpressions[0]).toHaveProperty("day", expect.any(Number));
    expect(data.yearlyImpressions[0]).toHaveProperty(
      "impressions",
      expect.any(Number)
    );
  });

  test("should return 400 if id is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/internal/leafwatch/profile/impressions`, {
        headers: getTestAuthHeaders()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 401 if the user is not staff", async () => {
    try {
      await axios.get(`${TEST_URL}/internal/leafwatch/profile/impressions`, {
        params: { id: TEST_LENS_ID },
        headers: getTestAuthHeaders("suspended")
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/internal/leafwatch/profile/impressions`, {
        params: { id: TEST_LENS_ID }
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
