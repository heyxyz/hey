import { hydrateTxnQueue } from "src/store/persisted/useTransactionStore";
import { beforeEach, describe, expect, test, vi } from "vitest";
import hasOptimisticallyCollected from "./hasOptimisticallyCollected";

// Mock transaction data
const mockTxnQueue = [
  { collectOn: "post123", txHash: "hash123", txId: "id123" },
  { collectOn: "post456", txHash: "hash456", txId: "id456" }
];

// Mock `hydrateTxnQueue` function
vi.mock("src/store/persisted/useTransactionStore", () => ({
  hydrateTxnQueue: vi.fn()
}));

describe("hasOptimisticallyCollected", () => {
  beforeEach(() => {
    // Reset the mock before each test
    vi.clearAllMocks();
  });

  test("should return true when the collectOn matches a transaction", () => {
    (hydrateTxnQueue as any).mockReturnValue(mockTxnQueue);

    const result = hasOptimisticallyCollected("post123");
    expect(result).toBe(true);
  });

  test("should return false when the collectOn does not match any transaction", () => {
    (hydrateTxnQueue as any).mockReturnValue(mockTxnQueue);

    const result = hasOptimisticallyCollected("post789");
    expect(result).toBe(false);
  });

  test("should return false when the txnQueue is empty", () => {
    (hydrateTxnQueue as any).mockReturnValue([]);

    const result = hasOptimisticallyCollected("post123");
    expect(result).toBe(false);
  });

  test("should return false when hydrateTxnQueue returns undefined", () => {
    (hydrateTxnQueue as any).mockReturnValue(undefined);

    const result = hasOptimisticallyCollected("post123");
    expect(result).toBe(false);
  });
});
