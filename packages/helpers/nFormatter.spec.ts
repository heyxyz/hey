import { describe, expect, test } from "vitest";
import nFormatter from "./nFormatter";

describe("nFormatter", () => {
  test("should format a number without any suffix if it is less than 1000", () => {
    const result = nFormatter(500);
    expect(result).toEqual("500");
  });

  test("should format a number without any suffix if it is less than 10000 and no digits provided", () => {
    const result = nFormatter(1234);
    expect(result).toEqual("1.2k");
  });

  test("should format a number with suffix if it is greater than or equal to 1 million", () => {
    const result = nFormatter(1234567890);
    expect(result).toEqual("1.2G");
  });

  test("should format a number with suffix and with specified decimal places", () => {
    const result = nFormatter(1234567, 2);
    expect(result).toEqual("1.23M");
  });

  test("should format a number with suffix and with default decimal places", () => {
    const result = nFormatter(1234567);
    expect(result).toEqual("1.2M");
  });

  test("should return '0' if input is zero", () => {
    const result = nFormatter(0);
    expect(result).toEqual("0");
  });

  test("should format a large number with appropriate SI prefix", () => {
    const result = nFormatter(1e12);
    expect(result).toEqual("1T");
  });

  test("should format a large number with a high number of decimal places", () => {
    const result = nFormatter(123456789012345, 3);
    expect(result).toEqual("123.457T");
  });

  test("should handle very small numbers (below 1k)", () => {
    const result = nFormatter(999);
    expect(result).toEqual("999");
  });

  test("should handle fractional numbers", () => {
    const result = nFormatter(1234.56);
    expect(result).toEqual("1.2k");
  });
});
