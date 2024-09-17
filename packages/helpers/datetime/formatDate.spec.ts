import { describe, expect, test } from "vitest";

import formatDate from "./formatDate";

describe("formatDate", () => {
  test("should correctly format a given date in default format", () => {
    const exampleDate = new Date("2024-12-01");
    const result = formatDate(exampleDate);
    const expectedResult = "December 1, 2024";
    expect(result).toBe(expectedResult);
  });

  test("should correctly format a given date in a custom format", () => {
    const exampleDate = new Date("2024-12-01");
    const result = formatDate(exampleDate, "YYYY-MM-DD");
    const expectedResult = "2024-12-01";
    expect(result).toBe(expectedResult);
  });

  test("should correctly format the current date in default format", () => {
    const result = formatDate(new Date());
    const expectedResult = new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    expect(result).toBe(expectedResult);
  });
});
