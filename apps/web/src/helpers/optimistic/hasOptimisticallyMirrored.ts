import { hydrateTxnQueue } from "src/store/persisted/useTransactionStore";

const hasOptimisticallyMirrored = (mirrorOn: string): boolean => {
  const txnQueue = hydrateTxnQueue();
  return txnQueue?.some((txn) => txn.mirrorOn === mirrorOn) || false;
};

export default hasOptimisticallyMirrored;
