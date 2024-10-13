import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("GET /lens/internal/stats/signup-revenue", () => {
  test("should return 200 and valid signups data", async () => {
    const { data, status } = await axios.get(
      `${TEST_URL}/lens/internal/stats/signup-revenue`,
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data).toBeDefined();
    expect(data.result).toBeInstanceOf(Array);
    expect(data.result[0]).toHaveProperty("date", expect.any(String));
    expect(data.result[0]).toHaveProperty("count", expect.any(Number));
  });

  test("should return 401 if the user is not staff", async () => {
    try {
      await axios.get(`${TEST_URL}/lens/internal/stats/signup-revenue`, {
        headers: getTestAuthHeaders("suspended")
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/lens/internal/stats/signup-revenue`);
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
