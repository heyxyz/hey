import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import { describe, expect, test } from "vitest";

describe("POST /clubs/join", () => {
  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.post(
        `${TEST_URL}/clubs/join`,
        { id: "validClubId" },
        { headers: {} } // No identity token provided
      );
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
