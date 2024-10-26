import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("GET /lists/publications", () => {
  test("should return 400 if no id is provided", async () => {
    try {
      await axios.get(`${TEST_URL}/lists/publications`, {
        headers: getTestAuthHeaders()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 with a list's profile's publications", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/lists/publications`, {
      params: { id: "0c34a529-8db6-40b8-9b35-7f474f7d509a" }
    });

    expect(status).toBe(200);
    expect(data.result).toHaveLength(50);
  });

  test("should return 200 with a list's profile's publications with pagination", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/lists/publications`, {
      params: { id: "0c34a529-8db6-40b8-9b35-7f474f7d509a", page: 2 }
    });

    expect(status).toBe(200);
    expect(data.result).toHaveLength(50);
    expect(data.offset).toBe(50);
  });
});
