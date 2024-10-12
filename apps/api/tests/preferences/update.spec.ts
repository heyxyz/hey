import { faker } from "@faker-js/faker";
import { TEST_LENS_ID } from "@hey/data/constants";
import { delRedis } from "@hey/db/redisClient";
import axios from "axios";
import { TEST_URL } from "tests/helpers/constants";
import getTestAuthHeaders from "tests/helpers/getTestAuthHeaders";
import { describe, expect, test } from "vitest";

describe("POST /preferences/update", () => {
  test("should return 200 and update preferences", async () => {
    const newAppIcon = faker.number.int({ min: 1, max: 10 });
    const highSignalNotificationFilter = faker.datatype.boolean();

    await delRedis(`preference:${TEST_LENS_ID}`);

    const { data, status } = await axios.post(
      `${TEST_URL}/preferences/update`,
      { appIcon: newAppIcon, highSignalNotificationFilter },
      { headers: getTestAuthHeaders() }
    );

    expect(status).toBe(200);
    expect(data.result).toBeDefined();
    expect(data.result.appIcon).toBe(newAppIcon);
    expect(data.result.highSignalNotificationFilter).toBe(
      highSignalNotificationFilter
    );
  });

  test("should return 400 if the request body is missing", async () => {
    try {
      await axios.post(
        `${TEST_URL}/preferences/update`,
        {},
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 400 for invalid request data", async () => {
    try {
      await axios.post(
        `${TEST_URL}/preferences/update`,
        { appIcon: "invalid", highSignalNotificationFilter: "invalid" },
        { headers: getTestAuthHeaders() }
      );
    } catch (error: any) {
      expect(error.response.status).toBe(400);
    }
  });

  test("should return 401 if the identity token is missing", async () => {
    try {
      await axios.post(`${TEST_URL}/preferences/update`, {
        appIcon: 3,
        highSignalNotificationFilter: true
      });
    } catch (error: any) {
      expect(error.response.status).toBe(401);
    }
  });
});
