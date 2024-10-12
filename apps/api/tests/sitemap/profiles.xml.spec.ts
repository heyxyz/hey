import lensPg from "@hey/db/lensPg";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import { describe, expect, test, vi } from "vitest";

describe("GET /sitemap/profiles.xml", () => {
  test("should return 200 and generate a sitemap with profile links", async () => {
    const mockCount = 1000;
    const SITEMAP_BATCH_SIZE = 100;
    vi.spyOn(lensPg, "query").mockResolvedValueOnce([{ count: mockCount }]);

    const { data, status, headers } = await axios.get(
      `${TEST_URL}/sitemap/profiles.xml`
    );

    expect(status).toBe(200);
    expect(headers["content-type"]).toBe("text/xml; charset=utf-8");

    const totalBatches = Math.ceil(mockCount / SITEMAP_BATCH_SIZE);

    for (let i = 1; i <= totalBatches; i++) {
      expect(data).toContain(
        `<loc>https://api.hey.xyz/sitemap/profiles/${i}.xml</loc>`
      );
    }
  });

  test("should return 500 if an error occurs", async () => {
    vi.spyOn(lensPg, "query").mockRejectedValueOnce(new Error("DB Error"));

    try {
      await axios.get(`${TEST_URL}/sitemap/profiles.xml`);
    } catch (error: any) {
      expect(error.response.status).toBe(500);
    }
  });
});
