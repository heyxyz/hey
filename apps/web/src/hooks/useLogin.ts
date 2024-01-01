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
    onConnect: () => setShowAuthModal(true)
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
