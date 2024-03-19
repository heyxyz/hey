import { hydrateTxnQueue } from 'src/store/persisted/useTransactionStore';

const hasOptimisticallyMirrored = (mirrorOn: string) => {
  const txnQueue = hydrateTxnQueue();

  if (!txnQueue) {
    return false;
  }

  return txnQueue.some((txn) => txn.mirrorOn === mirrorOn);
};

export default hasOptimisticallyMirrored;
