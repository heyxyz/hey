import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("POST /profile/status/update", () => {
  test("should return 400 if no body is provided", async () => {
    try {
      await axios.post(
        `${TEST_URL}/profile/status/update`,
        {},
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 400 for invalid body (missing required fields)", async () => {
    try {
      await axios.post(
        `${TEST_URL}/profile/status/update`,
        { randomField: "invalid" },
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 and update the profile status", async () => {
    const { data, status } = await axios.post(
      `${TEST_URL}/profile/status/update`,
      { emoji: "😀", message: "Status message" },
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.result).toBeDefined();
    expect(data.result.emoji).toBe("😀");
    expect(data.result.message).toBe("Status message");
  });
});
