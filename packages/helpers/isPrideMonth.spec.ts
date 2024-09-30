import { describe, expect, test, vi } from "vitest";
import isPrideMonth from "./isPrideMonth";

describe("isPrideMonth", () => {
  test("should return true if the current month is June", () => {
    vi.spyOn(Date.prototype, "getMonth").mockReturnValue(5); // June (month index 5)

    const result = isPrideMonth();
    expect(result).toBe(true);
  });

  test("should return false if the current month is not June (March)", () => {
    vi.spyOn(Date.prototype, "getMonth").mockReturnValue(2); // March (month index 2)

    const result = isPrideMonth();
    expect(result).toBe(false);
  });

  test("should return false if the current month is not June (December)", () => {
    vi.spyOn(Date.prototype, "getMonth").mockReturnValue(11); // December (month index 11)

    const result = isPrideMonth();
    expect(result).toBe(false);
  });

  test("should return false if the current month is not June (January)", () => {
    vi.spyOn(Date.prototype, "getMonth").mockReturnValue(0); // January (month index 0)

    const result = isPrideMonth();
    expect(result).toBe(false);
  });

  test("should return false if the current month is May (the month before June)", () => {
    vi.spyOn(Date.prototype, "getMonth").mockReturnValue(4); // May (month index 4)

    const result = isPrideMonth();
    expect(result).toBe(false);
  });
});
