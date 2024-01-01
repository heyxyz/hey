import { AUTH } from '@hey/data/tracking';
import { Leafwatch } from '@lib/leafwatch';
import { useModal } from 'connectkit';
import { useCallback } from 'react';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useAccount } from 'wagmi';

interface UseLoginProps {
  setOpenLoginModal: (open: boolean) => void;
}

const useLogin = (): UseLoginProps => {
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );
  const { isConnected } = useAccount();
  const { setOpen } = useModal({
    onConnect: ({ connectorId }) => {
      setShowAuthModal(true);
      Leafwatch.track(AUTH.CONNECT_WALLET, {
        wallet: connectorId?.toLowerCase()
      });
    }
  });

  const setOpenLoginModal = useCallback(
    (open: boolean) => {
      if (isConnected) {
        setShowAuthModal(open);
      } else {
        setOpen(open);
      }
    },
    [isConnected, setOpen, setShowAuthModal]
  );

  return { setOpenLoginModal };
};

export default useLogin;
