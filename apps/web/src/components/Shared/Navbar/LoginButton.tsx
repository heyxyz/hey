import type { FC } from 'react';

import { AUTH } from '@hey/data/tracking';
import { Button } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useModal } from 'connectkit';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useAccount } from 'wagmi';

interface LoginButtonProps {
  isBig?: boolean;
  title?: string;
}

const LoginButton: FC<LoginButtonProps> = ({
  isBig = false,
  title = 'Login'
}) => {
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );
  const { isConnected } = useAccount();
  const { setOpen } = useModal({
    onConnect: () => setShowAuthModal(true)
  });

  return (
    <Button
      icon={
        <img
          alt="Lens Logo"
          className="mr-0.5 h-3"
          height={12}
          src="/lens.svg"
          width={19}
        />
      }
      onClick={() => {
        if (isConnected) {
          setShowAuthModal(true);
        } else {
          setOpen(true);
        }
        Leafwatch.track(AUTH.LOGIN);
      }}
      size={isBig ? 'lg' : 'md'}
    >
      {title}
    </Button>
  );
};

export default LoginButton;
