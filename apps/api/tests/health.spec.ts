import axios from "axios";
import { describe, expect, test } from "vitest";
import { TEST_URL } from "./helpers/constants";

describe("GET /health", () => {
  test("should respond with status 200 and correct health information", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/health`);

    expect(status).toBe(200);
    expect(data.ping).toBe("pong");
  });
});
