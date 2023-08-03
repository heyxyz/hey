import { LogoutIcon } from '@heroicons/react/outline';
import { AUTH } from '@lenster/data/tracking';
import { Button, Spinner } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { Trans } from '@lingui/macro';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import type { FC } from 'react';
import React from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import useAuthPersistStore from 'src/store/auth';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';

import SignedUser from '../Navbar/SignedUser';
import SwitchNetwork from '../SwitchNetwork';

interface ConnectWalletButtonProps {
  handleSign: () => void;
  signing?: boolean;
}

const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({
  handleSign,
  signing
}) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const profileId = useAuthPersistStore((state) => state.profileId);

  const { connector, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const { openConnectModal } = useConnectModal();

  return connector?.id && isConnected ? (
    chain?.id === CHAIN_ID ? (
      profileId && currentProfile ? (
        <SignedUser />
      ) : (
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleSign}
            disabled={signing}
            icon={
              signing ? (
                <Spinner className="mr-0.5" size="xs" />
              ) : (
                <img
                  className="mr-0.5 h-4 w-4"
                  height={16}
                  width={16}
                  src="/lens.png"
                  alt="Lens Logo"
                />
              )
            }
          >
            <Trans>Sign-In with Lens</Trans>
          </Button>
          <Button variant="danger" onClick={() => disconnect?.()}>
            <LogoutIcon className="my-1 h-4 w-4" />
          </Button>
        </div>
      )
    ) : (
      <SwitchNetwork />
    )
  ) : (
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
        openConnectModal?.();
        Leafwatch.track(AUTH.LOGIN);
      }}
      data-testid="login-button"
    >
      <Trans>Login</Trans>
    </Button>
  );
};

export default ConnectWalletButton;
