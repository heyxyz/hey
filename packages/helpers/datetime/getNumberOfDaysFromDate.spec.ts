import dayjs from "dayjs";
import { describe, expect, test } from "vitest";

import getNumberOfDaysFromDate from "./getNumberOfDaysFromDate";

describe("getNumberOfDaysFromDate", () => {
  test("should return 0 for the current date", () => {
    const currentDate = new Date();
    const result = getNumberOfDaysFromDate(currentDate);
    expect(result).toBe(0);
  });

  test("should return 1 for tomorrow", () => {
    const tomorrow = dayjs().add(1, "day").toDate();
    const result = getNumberOfDaysFromDate(tomorrow);
    expect(result).toBe(1);
  });

  test("should return -1 for yesterday", () => {
    const yesterday = dayjs().subtract(1, "day").toDate();
    const result = getNumberOfDaysFromDate(yesterday);
    expect(result).toBe(-1);
  });

  test("should return correct number of days for a future date", () => {
    const futureDate = dayjs().add(5, "day").toDate();
    const result = getNumberOfDaysFromDate(futureDate);
    expect(result).toBe(5);
  });

  test("should return correct number of days for a past date", () => {
    const pastDate = dayjs().subtract(3, "day").toDate();
    const result = getNumberOfDaysFromDate(pastDate);
    expect(result).toBe(-3);
  });

  test("should return correct number of days for a date in a different month/year", () => {
    const differentMonthYear = new Date(2024, 0, 1); // January 1, 2024
    const daysDifference = dayjs(differentMonthYear)
      .startOf("day")
      .diff(dayjs().startOf("day"), "day");
    const result = getNumberOfDaysFromDate(differentMonthYear);
    expect(result).toBe(daysDifference);
  });
});
