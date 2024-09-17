import { hydrateTxnQueue } from "src/store/persisted/useTransactionStore";

const hasOptimisticallyCollected = (collectOn: string): boolean => {
  const txnQueue = hydrateTxnQueue();
  return txnQueue?.some((txn) => txn.collectOn === collectOn) || false;
};

export default hasOptimisticallyCollected;
