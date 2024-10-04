import axios from "axios";
import { TEST_URL } from "src/helpers/constants";
import { describe, expect, test } from "vitest";

describe("GET /lens/rate", () => {
  test("should return 200 and valid rate and structure", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/lens/rate`);

    expect(status).toBe(200);
    expect(data.result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          address: expect.any(String),
          decimals: expect.any(Number),
          fiat: expect.any(Number),
          name: expect.any(String),
          symbol: expect.any(String)
        })
      ])
    );
  });
});
