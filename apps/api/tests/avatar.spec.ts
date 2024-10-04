import { IPFS_GATEWAY } from "@hey/data/constants";
import axios from "axios";
import { TEST_URL } from "src/helpers/constants";
import { describe, expect, test } from "vitest";

describe("GET /avatar", () => {
  test("should return 400 if no id is provided", async () => {
    try {
      await axios.get(`${TEST_URL}/avatar`);
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return svg image if id is provided", async () => {
    const { data, status, headers } = await axios.get(`${TEST_URL}/avatar`, {
      params: { id: "0x0d" }
    });

    expect(status).toBe(200);
    expect(headers["content-type"]).toBe("image/svg+xml; charset=utf-8");
    expect(data).toContain("<svg");
  });

  test("should redirect to IPFS gateway if tokenURI fetching fails", async () => {
    const { status, headers } = await axios.get(`${TEST_URL}/avatar`, {
      params: { id: "invalid-id" },
      maxRedirects: 0,
      validateStatus: (status) => status === 302
    });

    expect(status).toBe(302);
    expect(headers["location"]).toBe(
      `${IPFS_GATEWAY}/Qmb4XppdMDCsS7KCL8nCJo8pukEWeqL4bTghURYwYiG83i/cropped_image.png`
    );
  });
});
