import { TEST_LENS_ID } from "@hey/data/constants";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("GET /lists/all", () => {
  test("should return 400 if no ownerId is provided", async () => {
    try {
      await axios.get(`${TEST_URL}/lists/all`, {
        headers: getTestAuthHeaders()
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 200 with a list of lists", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/lists/all`, {
      params: { ownerId: TEST_LENS_ID }
    });

    expect(status).toBe(200);
    expect(data.result).toBeDefined();
    expect(data.result.length).toBeGreaterThan(0);
    expect(data.result[0].totalPins).toStrictEqual(expect.any(Number));
    expect(data.result[0].totalProfiles).toStrictEqual(expect.any(Number));
  });

  test("should return 200 with isAdded as true if the user is added to the list", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/lists/all`, {
      params: { ownerId: "0x0d", viewingId: TEST_LENS_ID }
    });

    expect(status).toBe(200);
    expect(data.result[0].isAdded).toBe(true);
  });

  test("should return 200 with isAdded as false if the user is not added to the list", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/lists/all`, {
      params: { ownerId: TEST_LENS_ID, viewingId: "0x0d" }
    });

    expect(status).toBe(200);
    expect(data.result[0].isAdded).toBe(false);
  });

  test("should return 200 with pinned as true if the list is pinned", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/lists/all`, {
      params: { ownerId: "0x0d" }
    });

    expect(status).toBe(200);
    expect(data.result[0].pinned).toBe(true);
  });

  test("should return 200 with pinned as false if the list is not pinned", async () => {
    const { data, status } = await axios.get(`${TEST_URL}/lists/all`, {
      params: { ownerId: TEST_LENS_ID }
    });

    expect(status).toBe(200);
    expect(data.result[0].pinned).toBe(false);
  });
});
