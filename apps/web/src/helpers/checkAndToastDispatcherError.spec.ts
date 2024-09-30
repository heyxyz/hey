import { Errors } from "@hey/data/errors";
import { LensProfileManagerRelayErrorReasonType } from "@hey/lens";
import { toast } from "react-hot-toast";
import { beforeEach, describe, expect, test, vi } from "vitest";
import checkAndToastDispatcherError from "./checkAndToastDispatcherError";

// Mock the `toast.error` function
vi.mock("react-hot-toast", () => ({
  toast: { error: vi.fn() }
}));

describe("checkAndToastDispatcherError", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  test("should return false and toast RateLimited error", () => {
    const reason = LensProfileManagerRelayErrorReasonType.RateLimited;

    const result = checkAndToastDispatcherError(reason);

    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(Errors.RateLimited, {
      id: "error"
    });
  });

  test("should return false and toast AppNotAllowed error", () => {
    const reason = LensProfileManagerRelayErrorReasonType.AppNotAllowed;

    const result = checkAndToastDispatcherError(reason);

    expect(result).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(Errors.AppNotAllowed, {
      id: "error"
    });
  });

  test("should return true for reasons not related to RateLimited or AppNotAllowed", () => {
    const reason = "SomeOtherReason" as any;

    const result = checkAndToastDispatcherError(reason);

    expect(result).toBe(true);
    expect(toast.error).not.toHaveBeenCalled();
  });
});
