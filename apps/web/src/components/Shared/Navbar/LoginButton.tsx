import { Mixpanel } from '@lib/leafwatch';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useAuthStore } from 'src/store/auth';
import { AUTH } from 'src/tracking';
import { Button } from 'ui';

const LoginButton: FC = () => {
  const setShowAuthModal = useAuthStore((state) => state.setShowAuthModal);

  return (
    <Button
      icon={
        <img
          className="mr-0.5 h-4 w-4"
          height={16}
          width={16}
          src="/lens.png"
          alt="Lens Logo"
        />
      }
      onClick={() => {
        setShowAuthModal(true);
        Mixpanel.track(AUTH.LOGIN);
      }}
      data-testid="login-button"
    >
      <Trans>Login</Trans>
    </Button>
  );
};

export default LoginButton;
