import { useCallback } from 'react';
import { CHAIN_ID } from 'src/constants';
import { useGlobalModalStateStore } from 'src/store/modals';
import { useNetwork } from 'wagmi';

const useHandleWrongNetwork = () => {
  const setShowWrongNetworkModal = useGlobalModalStateStore(
    (state) => state.setShowWrongNetworkModal
  );
  const { chain } = useNetwork();

  const handleWrongNetwork = useCallback(() => {
    if (chain?.id !== CHAIN_ID) {
      setShowWrongNetworkModal(true);
      return true;
    }

    return false;
  }, [chain?.id, setShowWrongNetworkModal]);

  return handleWrongNetwork;
};

export default useHandleWrongNetwork;
