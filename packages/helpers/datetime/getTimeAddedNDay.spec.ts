import dayjs from "dayjs";
import { describe, expect, test } from "vitest";

import getTimeAddedNDay from "./getTimeAddedNDay";

describe("getTimeAddedNDay", () => {
  test("should add 0 days to the current date", () => {
    const currentDateUTC = dayjs().utc().format();
    const result = getTimeAddedNDay(0);
    expect(result).toBe(currentDateUTC);
  });

  test("should add 1 day to the current date", () => {
    const oneDayAddedUTC = dayjs().add(1, "day").utc().format();
    const result = getTimeAddedNDay(1);
    expect(result).toBe(oneDayAddedUTC);
  });

  test("should add 5 days to the current date", () => {
    const fiveDaysAddedUTC = dayjs().add(5, "day").utc().format();
    const result = getTimeAddedNDay(5);
    expect(result).toBe(fiveDaysAddedUTC);
  });

  test("should subtract 1 day from the current date", () => {
    const oneDaySubtractedUTC = dayjs().subtract(1, "day").utc().format();
    const result = getTimeAddedNDay(-1);
    expect(result).toBe(oneDaySubtractedUTC);
  });

  test("should subtract 10 days from the current date", () => {
    const tenDaysSubtractedUTC = dayjs().subtract(10, "day").utc().format();
    const result = getTimeAddedNDay(-10);
    expect(result).toBe(tenDaysSubtractedUTC);
  });

  test("should add a large number of days to test leap years and month changes", () => {
    const largeDaysAddedUTC = dayjs().add(400, "day").utc().format();
    const result = getTimeAddedNDay(400);
    expect(result).toBe(largeDaysAddedUTC);
  });
});
