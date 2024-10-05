import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import { describe, expect, test } from "vitest";

describe("GET /staff-picks", () => {
  test("should return 200 and provide staff picks", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/staff-picks`);

    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.result).toBeInstanceOf(Array);
    expect(data.result.length).toBeLessThanOrEqual(150);
  });
});
