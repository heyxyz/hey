import { Button } from '@components/UI/Button';
import { Analytics } from '@lib/analytics';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import { USER } from 'src/tracking';
import { useAccount, useDisconnect } from 'wagmi';

import { useLoginFlow } from '../GlobalModals';

const LoginButton: FC = () => {
  const { isConnected } = useAccount();
  const { showLoginFlow } = useLoginFlow();
  const { disconnect } = useDisconnect({
    onError(error) {
      toast.error(error?.message);
    }
  });

  return (
    <>
      <Button
        icon={<img className="mr-0.5 w-4 h-4" height={16} width={16} src="/lens.png" alt="Lens Logo" />}
        onClick={() => {
          showLoginFlow();
          Analytics.track(USER.LOGIN);
        }}
      >
        <Trans>Login</Trans>
      </Button>
      {isConnected && (
        <Button title="Disconnect wallet" onClick={() => disconnect?.()}>
          Disconnect wallet
        </Button>
      )}
    </>
  );
};

export default LoginButton;
