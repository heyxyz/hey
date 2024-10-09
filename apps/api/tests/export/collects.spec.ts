import { TEST_LENS_ID } from "@hey/data/constants";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("GET /export/collects", () => {
  test("should return 400 if no id is provided", async () => {
    try {
      await axios.get(`${TEST_URL}/export/collects`, {
        headers: getTestAuthHeaders()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 401 if the identity token doesn't match the target profile", async () => {
    try {
      await axios.get(`${TEST_URL}/export/collects`, {
        params: { id: "0x0d-0x04b9" },
        headers: getTestAuthHeaders()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });

  test(
    "should return 200 and download CSV of collected addresses",
    async () => {
      const { status, headers } = await axios.get(
        `${TEST_URL}/export/collects`,
        {
          params: { id: `${TEST_LENS_ID}-0x06` },
          headers: getTestAuthHeaders(),
          responseType: "blob"
        }
      );

      expect(status).toBe(200);
      expect(headers["content-type"]).toBe("text/csv; charset=utf-8");
      expect(headers["content-disposition"]).toContain(
        `attachment; filename="collect_addresses_${TEST_LENS_ID}-0x06.csv"`
      );
    },
    { timeout: 100000 }
  );
});
