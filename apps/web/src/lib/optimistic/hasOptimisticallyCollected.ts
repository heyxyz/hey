import { hydrateTxnQueue } from 'src/store/persisted/useTransactionStore';

const hasOptimisticallyCollected = (publicationId: string) => {
  const txnQueue = hydrateTxnQueue();

  if (!txnQueue) {
    return false;
  }

  return txnQueue.some((txn) => txn.collectOn === publicationId);
};

export default hasOptimisticallyCollected;
