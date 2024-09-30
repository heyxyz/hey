import { hydrateTxnQueue } from "src/store/persisted/useTransactionStore";
import { beforeEach, describe, expect, test, vi } from "vitest";
import hasOptimisticallyMirrored from "./hasOptimisticallyMirrored";

// Mock transaction data
const mockTxnQueue = [
  { mirrorOn: "post123", txHash: "hash123", txId: "id123" },
  { mirrorOn: "post456", txHash: "hash456", txId: "id456" }
];

// Mock `hydrateTxnQueue` function with `vi.fn`
vi.mock("src/store/persisted/useTransactionStore", () => ({
  hydrateTxnQueue: vi.fn()
}));

describe("hasOptimisticallyMirrored", () => {
  beforeEach(() => {
    // Clear the mock implementation before each test
    vi.clearAllMocks();
  });

  test("should return true when the mirrorOn matches a transaction", () => {
    (hydrateTxnQueue as any).mockReturnValue(mockTxnQueue);

    const result = hasOptimisticallyMirrored("post123");
    expect(result).toBe(true);
  });

  test("should return false when the mirrorOn does not match any transaction", () => {
    (hydrateTxnQueue as any).mockReturnValue(mockTxnQueue);

    const result = hasOptimisticallyMirrored("post789");
    expect(result).toBe(false);
  });

  test("should return false when the txnQueue is empty", () => {
    (hydrateTxnQueue as any).mockReturnValue([]);

    const result = hasOptimisticallyMirrored("post123");
    expect(result).toBe(false);
  });

  test("should return false when hydrateTxnQueue returns undefined", () => {
    (hydrateTxnQueue as any).mockReturnValue(undefined);

    const result = hasOptimisticallyMirrored("post123");
    expect(result).toBe(false);
  });
});
