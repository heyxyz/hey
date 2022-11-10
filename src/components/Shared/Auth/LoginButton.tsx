import { Button } from '@components/UI/Button';
import { Spinner } from '@components/UI/Spinner';
import { Leafwatch } from '@lib/leafwatch';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import type { FC } from 'react';
import toast from 'react-hot-toast';
import { CHAIN_ID } from 'src/constants';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { USER } from 'src/tracking';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';

import SignedUser from '../Navbar/SignedUser';

interface Props {
  handleSign: () => void;
  signing?: boolean;
}

const LoginButton: FC<Props> = ({ handleSign, signing }) => {
  const profileId = useAppPersistStore((state) => state.profileId);
  const currentProfile = useAppStore((state) => state.currentProfile);

  const { connector, isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork({
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message);
    }
  });
  const { chain } = useNetwork();
  const { openConnectModal } = useConnectModal();

  return connector?.id && isConnected ? (
    chain?.id === CHAIN_ID ? (
      profileId && currentProfile ? (
        <SignedUser />
      ) : (
        <Button
          disabled={signing}
          icon={
            signing ? (
              <Spinner className="mr-0.5" size="xs" />
            ) : (
              <img className="mr-0.5 w-4 h-4" height={16} width={16} src="/lens.png" alt="Lens Logo" />
            )
          }
          onClick={handleSign}
        >
          Sign-In with Lens
        </Button>
      )
    ) : (
      <Button onClick={() => switchNetwork && switchNetwork(CHAIN_ID)} variant="danger">
        <span className="text-white">Switch network</span>
      </Button>
    )
  ) : (
    <Button
      icon={<img className="mr-0.5 w-4 h-4" height={16} width={16} src="/lens.png" alt="Lens Logo" />}
      onClick={() => {
        openConnectModal?.();
        Leafwatch.track(USER.LOGIN);
      }}
    >
      Login
    </Button>
  );
};

export default LoginButton;
