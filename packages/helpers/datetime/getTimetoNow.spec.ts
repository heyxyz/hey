import dayjs from "dayjs";
import { describe, expect, test } from "vitest";

import getTimetoNow from "./getTimetoNow";

describe("getTimetoNow", () => {
  test("should format a date a few seconds in the past", () => {
    const fewSecondsAgo = dayjs().subtract(10, "seconds").toDate();
    const result = getTimetoNow(fewSecondsAgo);
    expect(result).toBe("a few seconds");
  });

  test("should format a date a few minutes in the past", () => {
    const fewMinutesAgo = dayjs().subtract(2, "minutes").toDate();
    const result = getTimetoNow(fewMinutesAgo);
    expect(result).toBe("2 minutes");
  });

  test("should format a date a few hours in the past", () => {
    const fewHoursAgo = dayjs().subtract(3, "hours").toDate();
    const result = getTimetoNow(fewHoursAgo);
    expect(result).toBe("3 hours");
  });

  test("should format a date a few days in the past", () => {
    const fewDaysAgo = dayjs().subtract(4, "days").toDate();
    const result = getTimetoNow(fewDaysAgo);
    expect(result).toBe("4 days");
  });

  test("should format a date a few weeks in the past", () => {
    const fewWeeksAgo = dayjs().subtract(3, "weeks").toDate();
    const result = getTimetoNow(fewWeeksAgo);
    expect(result).toMatch(/days/); // The exact text may vary
  });

  test("should format a date a few months in the past", () => {
    const fewMonthsAgo = dayjs().subtract(5, "months").toDate();
    const result = getTimetoNow(fewMonthsAgo);
    expect(result).toMatch(/months/); // The exact text may vary
  });

  test("should format a date a few years in the past", () => {
    const fewYearsAgo = dayjs().subtract(2, "years").toDate();
    const result = getTimetoNow(fewYearsAgo);
    expect(result).toMatch(/years/); // The exact text may vary
  });
});
