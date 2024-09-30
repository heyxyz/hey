import { describe, expect, test } from "vitest";
import slugify from "./slugify";

describe("slugify", () => {
  test("should convert text to lowercase and replace spaces with hyphens", () => {
    const text = "Hello World";
    const expectedSlug = "hello-world";
    expect(slugify(text)).toBe(expectedSlug);
  });

  test("should remove invalid characters", () => {
    const text = "Hello, World!";
    const expectedSlug = "hello-world";
    expect(slugify(text)).toBe(expectedSlug);
  });

  test("should replace multiple spaces with a single hyphen", () => {
    const text = "Hello    World";
    const expectedSlug = "hello-world";
    expect(slugify(text)).toBe(expectedSlug);
  });

  test("should replace multiple hyphens with a single hyphen", () => {
    const text = "Hello---World";
    const expectedSlug = "hello-world";
    expect(slugify(text)).toBe(expectedSlug);
  });

  test("should handle a string with only special characters", () => {
    const text = "!@#$%^&*()";
    const expectedSlug = "";
    expect(slugify(text)).toBe(expectedSlug);
  });

  test("should handle a string with numbers and letters", () => {
    const text = "Product 123";
    const expectedSlug = "product-123";
    expect(slugify(text)).toBe(expectedSlug);
  });

  test("should trim leading and trailing spaces before slugifying", () => {
    const text = "   Hello World   ";
    const expectedSlug = "hello-world";
    expect(slugify(text)).toBe(expectedSlug);
  });

  test("should return an empty string when the input is empty", () => {
    const text = "";
    const expectedSlug = "";
    expect(slugify(text)).toBe(expectedSlug);
  });

  test("should handle a mix of uppercase, lowercase, and special characters", () => {
    const text = "This is a Test -- with SPECIAL #characters";
    const expectedSlug = "this-is-a-test-with-special-characters";
    expect(slugify(text)).toBe(expectedSlug);
  });
});
