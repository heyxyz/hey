import { useCallback } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useChainId } from 'wagmi';

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
