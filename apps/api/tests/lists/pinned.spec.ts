import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("GET /lists/pinned", () => {
  test("should return 200 with a list of pinned lists", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/lists/pinned`, {
      headers: getTestAuthHeaders()
    });

    expect(status).toBe(200);
    expect(data.result).toBeDefined();
    expect(data.result.length).toBeGreaterThan(0);
    expect(data.result[0].totalPins).toStrictEqual(expect.any(Number));
    expect(data.result[0].totalProfiles).toStrictEqual(expect.any(Number));
    expect(data.result[0].pinned).toBe(true);
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/lists/pinned`);
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
