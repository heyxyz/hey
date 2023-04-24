import { Mixpanel } from '@lib/mixpanel';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useAuthStore } from 'src/store/auth';
import { AUTH } from 'src/tracking';
import { Button } from 'ui';

const LoginButton: FC = () => {
  const setShowAuthModal = useAuthStore((state) => state.setShowAuthModal);

  return (
    <Button
      onClick={() => {
        setShowAuthModal(true);
        Mixpanel.track(AUTH.LOGIN);
      }}
      className="bg-brand text-darker rounded-full border-none text-sm font-medium uppercase hover:bg-white"
      data-testid="login-button"
    >
      <Trans>Login</Trans>
    </Button>
  );
};

export default LoginButton;
