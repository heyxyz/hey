import axios from "axios";
import { TEST_URL } from "src/helpers/constants";
import { describe, expect, test } from "vitest";

describe("POST /metadata", () => {
  test("should return 400 if no body is provided", async () => {
    try {
      await axios.post(`${TEST_URL}/metadata`);
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should upload signed metadata to S3 and return success", async () => {
    const metadata = {
      $schema: "https://json-schemas.lens.dev/profile/2.0.0.json",
      lens: {
        id: "ee5755ad-6655-4327-a5ef-c57b85855f33",
        name: "Yoginth"
      }
    };

    const { data, status } = await axios.post(`${TEST_URL}/metadata`, metadata);

    expect(status).toBe(200);
    expect(data.id).toMatch(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[4][0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
    );
  });
});
