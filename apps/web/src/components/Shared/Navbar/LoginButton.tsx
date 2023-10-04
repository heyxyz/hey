import { AUTH } from '@hey/data/tracking';
import { Button } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';

interface LoginButtonProps {
  isBig?: boolean;
}

const LoginButton: FC<LoginButtonProps> = ({ isBig = false }) => {
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );

  return (
    <Button
      size={isBig ? 'lg' : 'md'}
      icon={<img className="mr-0.5 h-3" src="/lens.svg" alt="Lens Logo" />}
      onClick={() => {
        setShowAuthModal(true);
        Leafwatch.track(AUTH.LOGIN);
      }}
      data-testid="login-button"
    >
      <Trans>Login</Trans>
    </Button>
  );
};

export default LoginButton;
