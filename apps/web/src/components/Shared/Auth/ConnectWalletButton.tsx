import { LogoutIcon } from '@heroicons/react/outline';
import { AUTH } from '@lenster/data/tracking';
import { Button, Tooltip } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { Trans } from '@lingui/macro';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import React from 'react';
import { CHAIN_ID } from 'src/constants';
import { useAppStore } from 'src/store/app';
import useAuthPersistStore from 'src/store/auth';
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';

import SignedUser from '../Navbar/SignedUser';

type Props = {
  handleSign: () => void;
  signing?: boolean;
};

const ConnectWalletButton = ({ handleSign, signing }: Props) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const profileId = useAuthPersistStore((state) => state.profileId);

  const { connector, isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const { openConnectModal } = useConnectModal();

  return connector?.id && isConnected ? (
    chain?.id === CHAIN_ID ? (
      profileId && currentProfile ? (
        <SignedUser />
      ) : (
        <div className="flex items-center space-x-2">
          <Button onClick={() => handleSign()} disabled={signing}>
            <Trans>Sign In</Trans>
            <span className="ml-1 hidden md:inline-block">
              <Trans>with Lens</Trans>
            </span>
          </Button>
          <Tooltip content="Disconnect Wallet">
            <button
              className="btn-danger p-2 md:p-2.5"
              onClick={() => disconnect?.()}
            >
              <LogoutIcon className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>
      )
    ) : (
      <Button onClick={() => switchNetwork?.(CHAIN_ID)} variant="danger">
        <span className="text-white">
          <Trans>Switch network</Trans>
        </span>
      </Button>
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
