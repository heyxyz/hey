import { hydrateTxnQueue } from "src/store/persisted/useTransactionStore";

const hasOptimisticallyMirrored = (repostOf: string): boolean => {
  const txnQueue = hydrateTxnQueue();
  return txnQueue?.some((txn) => txn.repostOf === repostOf) || false;
};

export default hasOptimisticallyMirrored;
