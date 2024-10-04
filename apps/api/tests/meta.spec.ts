import axios from "axios";
import { describe, expect, test } from "vitest";
import { TEST_URL } from "./constants";

describe("GET /meta", () => {
  test("should respond with status 200 and correct meta information", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/meta`);

    expect(status).toBe(200);
    expect(data).toEqual({
      meta: {
        deployment: "unknown",
        replica: "unknown",
        snapshot: "unknown"
      },
      responseTimes: expect.objectContaining({
        clickhouse: expect.any(String),
        hey: expect.any(String),
        lens: expect.any(String),
        redis: expect.any(String)
      })
    });
  });
});
