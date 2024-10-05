import {
  TEST_LENS_ID,
  TEST_PRO_LENS_ID,
  TEST_SUSPENDED_LENS_ID
} from "@hey/data/constants";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import { afterAll, describe, expect, test } from "vitest";
import setTestId from "../helpers/setTestId";

describe("GET /profile/get", () => {
  afterAll(async () => {
    await setTestId("GET /profile/get");
  });

  test("should return 400 if no id is provided", async () => {
    try {
      await axios.get(`${TEST_URL}/profile/get`);
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 with null pro, status, and theme if not pro", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/profile/get`, {
      params: { id: TEST_LENS_ID }
    });

    expect(status).toBe(200);
    expect(data.result.pro).toBeNull();
    expect(data.result.status).toBeNull();
    expect(data.result.theme).toBeNull();
    expect(data.result.isSuspended).toBe(false);
  });

  test("should return 200 with pro, status, and theme if pro", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/profile/get`, {
      params: { id: TEST_PRO_LENS_ID }
    });

    expect(status).toBe(200);
    expect(data.result.pro.isPro).toBeTruthy();
    expect(data.result.status.emoji).toBe("😀");
    expect(data.result.status.message).toBe("Status message");
    expect(data.result.theme.overviewFontStyle).toBe("archivo");
    expect(data.result.theme.publicationFontStyle).toBe("archivoNarrow");
    expect(data.result.isSuspended).toBe(false);
  });

  test("should return 200 and suspended status for a suspended profile", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/profile/get`, {
      params: { id: TEST_SUSPENDED_LENS_ID }
    });

    expect(status).toBe(200);
    expect(data.result.isSuspended).toBe(true);
  });
});
