import { Button } from '@components/UI/Button';
import { Analytics } from '@lib/analytics';
import { Trans } from '@lingui/macro';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import type { FC } from 'react';
import { useAuthStore } from 'src/store/auth';
import { USER } from 'src/tracking';

const LoginButton: FC = () => {
  const setShowLoginFlow = useAuthStore((state) => state.setShowLoginFlow);
  const { openConnectModal } = useConnectModal();

  return (
    <Button
      icon={<img className="mr-0.5 w-4 h-4" height={16} width={16} src="/lens.png" alt="Lens Logo" />}
      onClick={() => {
        if (openConnectModal) {
          openConnectModal();
        }
        setShowLoginFlow(true);
        Analytics.track(USER.LOGIN);
      }}
    >
      <Trans>Login</Trans>
    </Button>
  );
};

export default LoginButton;
