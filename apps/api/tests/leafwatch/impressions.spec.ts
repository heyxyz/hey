import axios from "axios";
import { TEST_URL } from "src/helpers/constants";
import { describe, expect, test } from "vitest";

describe("POST /leafwatch/impressions", () => {
  test("should return 400 if no body is provided", async () => {
    try {
      await axios.post(`${TEST_URL}/leafwatch/impressions`, {});
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 400 for invalid body (non-array or empty ids)", async () => {
    try {
      await axios.post(`${TEST_URL}/leafwatch/impressions`, {
        ids: "not-an-array"
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }

    try {
      await axios.post(`${TEST_URL}/leafwatch/impressions`, { ids: [] });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 for valid body and ingest impressions", async () => {
    const { data, status } = await axios.post(
      `${TEST_URL}/leafwatch/impressions`,
      { ids: ["0x0d-0x01", "0x0d-0x02", "0x0d-0x03"] }
    );

    expect(status).toBe(200);
    expect(data.queue).toBeDefined();
  });

  test("should return 500 on server error", async () => {
    try {
      await axios.post(`${TEST_URL}/leafwatch/impressions`, {
        ids: ["invalid_id"]
      });
    } catch (error: any) {
      expect(error.response.status).toBe(500);
    }
  });
});
