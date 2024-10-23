import { TEST_LENS_ID } from "@hey/data/constants";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("GET /lists/all", () => {
  test("should return 400 if no id is provided", async () => {
    try {
      await axios.get(`${TEST_URL}/lists/all`, {
        headers: getTestAuthHeaders()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 with a list of lists", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/lists/all`, {
      params: { id: TEST_LENS_ID }
    });

    expect(status).toBe(200);
    expect(data.result).toBeDefined();
    expect(data.result.length).toBeGreaterThan(0);
    expect(data.result[0].count).toStrictEqual(expect.any(Number));
  });
});
