import type { FC } from 'react';

import { WalletIcon } from '@heroicons/react/24/outline';
import { Button } from '@hey/ui';
import { useModal } from 'connectkit';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

const ConnectWallet: FC = () => {
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );
  // const { isConnected } = useAccount();
  const { setOpen } = useModal({
    onConnect: () => {
      alert('connected');
      setShowAuthModal(false);
    }
  });

  return (
    <Button
      className="w-full justify-center"
      icon={<WalletIcon className="size-5" />}
      onClick={() => setOpen(true)}
      outline
    >
      Connect Wallet
    </Button>
  );
};

export default ConnectWallet;
