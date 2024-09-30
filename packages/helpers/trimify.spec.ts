import { describe, expect, test } from "vitest";
import trimify from "./trimify";

describe("trimify", () => {
  test("should remove multiple line breaks and spaces correctly", () => {
    const str = "Hello.\n\nHow are you?\n\n  \nFine, thanks!   ";
    expect(trimify(str)).toBe("Hello.\n\nHow are you?\n\nFine, thanks!");
  });

  test("should work with empty strings", () => {
    expect(trimify("")).toBe("");
  });

  test("should remove leading and trailing spaces", () => {
    const str = "   Hello world   ";
    expect(trimify(str)).toBe("Hello world");
  });

  test("should remove excess newlines in between text", () => {
    const str = "Hello.\n\n\nHow are you?\n\n\nFine, thanks!";
    expect(trimify(str)).toBe("Hello.\n\nHow are you?\n\nFine, thanks!");
  });

  test("should handle strings with only newlines", () => {
    const str = "\n\n\n";
    expect(trimify(str)).toBe("");
  });

  test("should handle strings with no newlines", () => {
    const str = "Hello world";
    expect(trimify(str)).toBe("Hello world");
  });

  test("should handle multiple newlines and spaces at the beginning and end of the string", () => {
    const str = "\n\n  \nHello world\n  \n\n";
    expect(trimify(str)).toBe("Hello world");
  });
});
