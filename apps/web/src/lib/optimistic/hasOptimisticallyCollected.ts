import { hydrateTxnQueue } from 'src/store/persisted/useTransactionStore';

const hasOptimisticallyCollected = (collectOn: string) => {
  const txnQueue = hydrateTxnQueue();

  if (!txnQueue) {
    return false;
  }

  return txnQueue.some((txn) => txn.collectOn === collectOn);
};

export default hasOptimisticallyCollected;
