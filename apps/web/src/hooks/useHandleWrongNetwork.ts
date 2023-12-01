import { CHAIN_ID } from '@constants';
import { useCallback } from 'react';
import { useChainId } from 'wagmi';

import { useGlobalModalStateStore } from '@/store/non-persisted/useGlobalModalStateStore';

const useHandleWrongNetwork = () => {
  const setShowWrongNetworkModal = useGlobalModalStateStore(
    (state) => state.setShowWrongNetworkModal
  );
  const chain = useChainId();

  const handleWrongNetwork = useCallback(() => {
    if (chain !== CHAIN_ID) {
      setShowWrongNetworkModal(true);
      return true;
    }

    return false;
  }, [chain, setShowWrongNetworkModal]);

  return handleWrongNetwork;
};

export default useHandleWrongNetwork;
