import axios from "axios";
import { describe, expect, test } from "vitest";
import { TEST_URL } from "../constants";

describe("POST /clubs/get", () => {
  test("should return 400 if no body is provided", async () => {
    try {
      await axios.post(`${TEST_URL}/clubs/get`, {});
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 400 for invalid body", async () => {
    try {
      await axios.post(`${TEST_URL}/clubs/get`, {
        club_handle: "test_club",
        limit: 100
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 and fetch clubs for valid body", async () => {
    const { data, status } = await axios.post(`${TEST_URL}/clubs/get`, {
      club_handle: "bonsai",
      profile_id: "0x0d"
    });

    expect(status).toBe(200);
    expect(data.data.items[0]).toMatchObject({
      id: "65e6dec26d85271723b6357c",
      handle: "bonsai",
      role: "member",
      totalMembers: expect.any(Number)
    });
  });
});
