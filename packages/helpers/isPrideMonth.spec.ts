import { describe, expect, test, vi } from "vitest";

import isPrideMonth from "./isPrideMonth";

describe("isPrideMonth", () => {
  test("should return true if the current month is June", () => {
    vi.spyOn(Date.prototype, "getMonth").mockReturnValue(5);

    const result = isPrideMonth();
    expect(result).toBe(true);
  });

  test("should return false if the current month is not June", () => {
    vi.spyOn(Date.prototype, "getMonth").mockReturnValue(3);

    const result = isPrideMonth();
    expect(result).toBe(false);
  });
});
