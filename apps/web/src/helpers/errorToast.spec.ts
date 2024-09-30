import { Errors } from "@hey/data/errors";
import { toast } from "react-hot-toast";
import { beforeEach, describe, expect, test, vi } from "vitest";
import errorToast from "./errorToast";

// Mock the `toast.error` function
vi.mock("react-hot-toast", () => ({
  toast: { error: vi.fn() }
}));

describe("errorToast", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
  });

  test("should not call toast if error message contains 'viem'", () => {
    const error = { message: "some viem error" };
    errorToast(error);
    expect(toast.error).not.toHaveBeenCalled();
  });

  test("should call toast with UnpredictableGasLimit error if error message contains 'UNPREDICTABLE_GAS_LIMIT'", () => {
    const error = { message: "UNPREDICTABLE_GAS_LIMIT: gas limit issue" };
    errorToast(error);
    expect(toast.error).toHaveBeenCalledWith(Errors.UnpredictableGasLimit, {
      id: "error"
    });
  });

  test("should call toast with connector error if error message contains 'Connector not connected'", () => {
    const error = { message: "Connector not connected: please connect" };
    errorToast(error);
    expect(toast.error).toHaveBeenCalledWith(
      "Connect or switch to the correct wallet!",
      { id: "connector-error" }
    );
  });

  test("should call toast with error message if data.message is not available", () => {
    const error = { message: "Generic error" };
    errorToast(error);
    expect(toast.error).toHaveBeenCalledWith("Generic error", { id: "error" });
  });
});
