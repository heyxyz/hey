import { HEY_API_URL } from "@hey/data/constants";
import { describe, expect, test } from "vitest";
import getLennyURL from "./getLennyURL";

describe("getLennyURL", () => {
  test("should return the correct lenny avatar URL", () => {
    const id = "0x0d";
    const expectedURL = `${HEY_API_URL}/avatar?id=${id}`;
    const result = getLennyURL(id);

    expect(result).toBe(expectedURL);
  });

  test("should handle empty ID string", () => {
    const id = "";
    const expectedURL = `${HEY_API_URL}/avatar?id=`;
    const result = getLennyURL(id);

    expect(result).toBe(expectedURL);
  });

  test("should handle special characters in the ID", () => {
    const id = "lenny-123!@#";
    const expectedURL = `${HEY_API_URL}/avatar?id=lenny-123%21%40%23`;
    const result = getLennyURL(id);

    expect(result).toBe(expectedURL);
  });

  test("should handle numeric ID", () => {
    const id = "12345";
    const expectedURL = `${HEY_API_URL}/avatar?id=12345`;
    const result = getLennyURL(id);

    expect(result).toBe(expectedURL);
  });

  test("should handle long ID", () => {
    const id = "long-id-abcdefghijklmnopqrstuvwxyz1234567890";
    const expectedURL = `${HEY_API_URL}/avatar?id=${id}`;
    const result = getLennyURL(id);

    expect(result).toBe(expectedURL);
  });
});
