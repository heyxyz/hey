import { describe, expect, test, vi } from "vitest";
import getUserLocale from "./getUserLocale";

// Mock the navigator object
vi.stubGlobal("navigator", {
  languages: [],
  language: ""
});

describe("getUserLocale", () => {
  test("should return the first locale from navigator.languages if available", () => {
    (navigator as any).languages = ["fr-FR", "en-US"];
    const result = getUserLocale();
    expect(result).toBe("fr");
  });

  test("should return navigator.language if navigator.languages is not available", () => {
    (navigator as any).languages = [];
    (navigator as any).language = "es-ES";
    const result = getUserLocale();
    expect(result).toBe("es");
  });

  test("should return 'en' as default if no language is available", () => {
    (navigator as any).languages = [];
    (navigator as any).language = "";
    const result = getUserLocale();
    expect(result).toBe("en");
  });

  test("should handle different formats of locales correctly", () => {
    (navigator as any).languages = ["zh-CN"];
    const result = getUserLocale();
    expect(result).toBe("zh");
  });
});
