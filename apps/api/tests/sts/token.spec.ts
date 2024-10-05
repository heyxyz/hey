import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import { describe, expect, test } from "vitest";

describe("GET /sts/token", () => {
  test("should return 200 and provide temporary STS credentials", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/sts/token`);

    expect(status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.accessKeyId).toBeDefined();
    expect(data.secretAccessKey).toBeDefined();
    expect(data.sessionToken).toBeDefined();
  });
});
