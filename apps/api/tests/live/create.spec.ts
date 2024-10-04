import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("POST /live/create", () => {
  test("should return 400 if no body is provided", async () => {
    try {
      await axios.post(
        `${TEST_URL}/live/create`,
        {},
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 and create live stream with recording enabled", async () => {
    const { data, status } = await axios.post(
      `${TEST_URL}/live/create`,
      { record: true },
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.result).toMatchObject({
      record: true,
      createdByTokenName: "Hey Live"
    });
  });

  test("should return 200 and create live stream with recording disabled", async () => {
    const { data, status } = await axios.post(
      `${TEST_URL}/live/create`,
      { record: false },
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.result).toMatchObject({
      record: false,
      createdByTokenName: "Hey Live"
    });
  });
});
