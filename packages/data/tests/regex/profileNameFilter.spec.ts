import { describe, expect, test } from "vitest";
import { Regex } from "../../regex";

describe("Regex.profileNameFilter", () => {
  test("should remove all restricted symbols from a profile name", () => {
    const name = "John Doe ☑️✔️";
    const result = name.replace(Regex.profileNameFilter, "");
    expect(result).toBe("John Doe ");
  });

  test("should not modify a profile name without restricted symbols", () => {
    const name = "Jane Doe";
    const result = name.replace(Regex.profileNameFilter, "");
    expect(result).toBe(name);
  });

  test("should handle a profile name with multiple restricted symbols", () => {
    const name = "Jane ✅Doe✓✔";
    const result = name.replace(Regex.profileNameFilter, "");
    expect(result).toBe("Jane Doe");
  });

  test("should handle a profile name with only restricted symbols", () => {
    const name = "☑️✓✔✅";
    const result = name.replace(Regex.profileNameFilter, "");
    expect(result).toBe("");
  });

  test("should remove restricted symbols even if they are in the middle of the name", () => {
    const name = "Jo☑️hn D✔️oe";
    const result = name.replace(Regex.profileNameFilter, "");
    expect(result).toBe("John Doe");
  });

  test("should handle empty string as input", () => {
    const name = "";
    const result = name.replace(Regex.profileNameFilter, "");
    expect(result).toBe("");
  });

  test("should handle profile names with no visible changes", () => {
    const name = "John Doe";
    const result = name.replace(Regex.profileNameFilter, "");
    expect(result).toBe("John Doe");
  });

  test("should handle profile names with trailing restricted symbols", () => {
    const name = "John Doe✅";
    const result = name.replace(Regex.profileNameFilter, "");
    expect(result).toBe("John Doe");
  });

  test("should handle profile names with leading restricted symbols", () => {
    const name = "☑️John Doe";
    const result = name.replace(Regex.profileNameFilter, "");
    expect(result).toBe("John Doe");
  });
});
