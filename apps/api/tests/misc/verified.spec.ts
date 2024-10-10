import { TEST_LENS_ID } from "@hey/data/constants";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import { describe, expect, test } from "vitest";

describe("GET /misc/verified", () => {
  test("should return 200 and fetch the verified profiles", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/misc/verified`);

    expect(status).toBe(200);
    expect(data.result).toBeInstanceOf(Array);
    expect(data.result).contains(TEST_LENS_ID);
  });
});
