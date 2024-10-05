import axios from "axios";
import { describe, expect, test } from "vitest";
import { TEST_URL } from "../helpers/constants";

describe("GET /tokens/all", () => {
  test("should return 200 and valid tokens and structure", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/tokens/all`);

    expect(status).toBe(200);
    expect(data.tokens).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          symbol: expect.any(String),
          decimals: expect.any(Number),
          contractAddress: expect.any(String),
          priority: expect.any(Number),
          createdAt: expect.any(String)
        })
      ])
    );
  });
});
