import { TEST_LENS_ID } from "@hey/data/constants";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("GET /internal/leafwatch/profile/haveUsedHey", () => {
  test("should return 200 and true if the actor has used Hey", async () => {
    const { data, status } = await axios.get(
      `${TEST_URL}/internal/leafwatch/profile/haveUsedHey`,
      { params: { id: TEST_LENS_ID }, headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.haveUsedHey).toBe(true);
  });

  test("should return 200 and false if the actor has never used Hey", async () => {
    const { data, status } = await axios.get(
      `${TEST_URL}/internal/leafwatch/profile/haveUsedHey`,
      { params: { id: "0x00" }, headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.haveUsedHey).toBe(false);
  });

  test("should return 400 if id is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/internal/leafwatch/profile/haveUsedHey`, {
        headers: getTestAuthHeaders()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.get(`${TEST_URL}/internal/leafwatch/profile/haveUsedHey`, {
        params: { id: TEST_LENS_ID }
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });

  test("should return 401 if the user is not staff", async () => {
    try {
      await axios.get(`${TEST_URL}/internal/leafwatch/profile/haveUsedHey`, {
        params: { id: TEST_LENS_ID },
        headers: getTestAuthHeaders()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
