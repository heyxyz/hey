import { describe, expect, test } from "vitest";
import getAppName from "./getAppName";

describe("getAppName", () => {
  test("should capitalize first character and replace hyphen with a space in a string", () => {
    const inputString = "my-app";
    const expectedOutput = "My app";
    expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test("should handle empty string as input", () => {
    const inputString = "";
    const expectedOutput = "";
    expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test("should handle single character as input", () => {
    const inputString = "a";
    const expectedOutput = "A";
    expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test("should handle input with no hyphens and only a single word", () => {
    const inputString = "word";
    const expectedOutput = "Word";
    expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test("should handle input with multiple hyphens", () => {
    const inputString = "one-two-three-four";
    const expectedOutput = "One two three four";
    expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test("should handle input with leading hyphen", () => {
    const inputString = "-leading-hyphen";
    const expectedOutput = " leading hyphen";
    expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test("should handle input with trailing hyphen", () => {
    const inputString = "trailing-hyphen-";
    const expectedOutput = "Trailing hyphen ";
    expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test("should handle input with multiple consecutive hyphens", () => {
    const inputString = "multiple---hyphens";
    const expectedOutput = "Multiple   hyphens";
    expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test("should not change input when there are no hyphens but mixed case", () => {
    const inputString = "TestApp";
    const expectedOutput = "TestApp";
    expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test("should capitalize input that contains numbers and hyphens", () => {
    const inputString = "app-123-name";
    const expectedOutput = "App 123 name";
    expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test("should handle input that is already properly formatted", () => {
    const inputString = "My App";
    const expectedOutput = "My App";
    expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test("should handle input with a single hyphen", () => {
    const inputString = "-";
    const expectedOutput = " ";
    expect(getAppName(inputString)).toBe(expectedOutput);
  });

  test("should handle input with only hyphens", () => {
    const inputString = "---";
    const expectedOutput = "   ";
    expect(getAppName(inputString)).toBe(expectedOutput);
  });
});
