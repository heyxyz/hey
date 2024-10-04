import { PAGEVIEW } from "@hey/data/tracking";
import axios from "axios";
import { describe, expect, test } from "vitest";
import { TEST_URL } from "../helpers/constants";

describe("POST /leafwatch/events", () => {
  test("should return 400 if no body is provided", async () => {
    try {
      await axios.post(`${TEST_URL}/leafwatch/events`, {});
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 400 if event name is missing", async () => {
    try {
      await axios.post(`${TEST_URL}/leafwatch/events`, {
        events: [{ url: "https://example.com", properties: {} }]
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 400 if invalid event name is found", async () => {
    try {
      await axios.post(`${TEST_URL}/leafwatch/events`, {
        events: [{ name: "InvalidEventName", url: "https://example.com" }]
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.error).toBe("Invalid event found!");
    }
  });

  test("should return 200 with single valid event", async () => {
    const { data, status } = await axios.post(`${TEST_URL}/leafwatch/events`, {
      events: [{ name: PAGEVIEW, url: "https://hey.xyz" }]
    });

    expect(status).toBe(200);
    expect(data.queue).toBeDefined();
  });

  test("should return 200 with multiple valid events", async () => {
    const { data, status } = await axios.post(`${TEST_URL}/leafwatch/events`, {
      events: [
        { name: PAGEVIEW, url: "https://hey.xyz" },
        { name: PAGEVIEW, url: "https://hey.xyz" }
      ]
    });

    expect(status).toBe(200);
    expect(data.queue).toBeDefined();
  });

  test("should return 400 if event url is missing", async () => {
    try {
      await axios.post(`${TEST_URL}/leafwatch/events`, {
        events: [{ name: PAGEVIEW }]
      });
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });
});
