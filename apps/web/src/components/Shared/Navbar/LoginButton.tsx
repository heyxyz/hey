import { AUTH } from '@lenster/data/tracking';
import { Button } from '@lenster/ui';
import { PostHog } from '@lib/posthog';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';

const LoginButton: FC = () => {
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setShowAuthModal
  );

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
        PostHog.track(AUTH.LOGIN);
      }}
      data-testid="login-button"
    >
      <Trans>Login</Trans>
    </Button>
  );
};

export default LoginButton;
