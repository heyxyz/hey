import dayjs from "dayjs";
import { describe, expect, test } from "vitest";

import formatRelativeOrAbsolute from "./formatRelativeOrAbsolute";

describe("formatRelativeOrAbsolute", () => {
  test("should format a date a few seconds old as seconds", () => {
    const now = new Date();
    const fewSecondsAgo = new Date(now.getTime() - 10 * 1000);
    const result = formatRelativeOrAbsolute(fewSecondsAgo);
    expect(result).toBe("10s");
  });

  test("should format a date a few minutes old as minutes", () => {
    const now = new Date();
    const fewMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    const result = formatRelativeOrAbsolute(fewMinutesAgo);
    expect(result).toBe("10m");
  });

  test("should format a date a few hours old as hours", () => {
    const now = new Date();
    const fewHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    const result = formatRelativeOrAbsolute(fewHoursAgo);
    expect(result).toBe("3h");
  });

  test("should format a date more than a day but less than a week old as days", () => {
    const now = new Date();
    const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);
    const result = formatRelativeOrAbsolute(fourDaysAgo);
    expect(result).toBe("4d");
  });

  test("should format a date older than a week but within the same year as MMM D", () => {
    const now = new Date();
    const lastYear = new Date(now.getFullYear() - 1, 11, 25);
    const result = formatRelativeOrAbsolute(lastYear);
    const expected = dayjs(lastYear).format("MMM D, YYYY");
    expect(result).toBe(expected);
  });

  test("should format a date older than a week and in a different year as MMM D, YYYY", () => {
    const olderDate = new Date(2020, 0, 1);
    const result = formatRelativeOrAbsolute(olderDate);
    const expected = dayjs(olderDate).format("MMM D, YYYY");
    expect(result).toBe(expected);
  });
});
