import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import waitForTestCompletion from "tests/helpers/waitForTestCompletion";
import { beforeAll, describe, expect, test } from "vitest";

describe("POST /profile/theme/reset", () => {
  beforeAll(async () => {
    await waitForTestCompletion("GET /profile/get");
  });

  test("should return 200 and reset the profile theme as a pro user", async () => {
    const { data, status } = await axios.post(
      `${TEST_URL}/profile/theme/reset`,
      null,
      { headers: getTestAuthHeaders("pro") }
    );

    expect(status).toBe(200);
    expect(data.success).toBeTruthy();
  });

  test("should return 401 for a normal user", async () => {
    try {
      await axios.post(`${TEST_URL}/profile/theme/reset`, null, {
        headers: getTestAuthHeaders()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
