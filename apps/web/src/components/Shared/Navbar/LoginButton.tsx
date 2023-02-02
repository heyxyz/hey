import { Button } from '@components/UI/Button';
import { Spinner } from '@components/UI/Spinner';
import useLoginFlow from '@components/utils/hooks/useLoginFlow';
import { Analytics } from '@lib/analytics';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from 'src/store/auth';
import { USER } from 'src/tracking';
import { useAccount, useDisconnect } from 'wagmi';

const LoginButton: FC = () => {
  const { isConnected } = useAccount();
  const { showLoginFlow } = useLoginFlow();
  const { disconnect } = useDisconnect({
    onError(error) {
      toast.error(error?.message);
    }
  });
  const signingInProgress = useAuthStore((state) => state.signingInProgress);

  return (
    <>
      <Button
        disabled={signingInProgress}
        icon={
          signingInProgress ? (
            <Spinner className="mr-0.5" size="xs" />
          ) : (
            <img className="mr-0.5 h-4 w-4" height={16} width={16} src="/lens.png" alt="Lens Logo" />
          )
        }
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
