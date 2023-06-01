import WalletSelector from '@components/Shared/Login/WalletSelector';
import { Trans } from '@lingui/macro';
import { APP_NAME, IS_MAINNET } from 'data/constants';
import type { FC } from 'react';
import { useState } from 'react';

import NewProfile from './New';

const Login: FC = () => {
  const [hasConnected, setHasConnected] = useState(false);
  const [hasProfile, setHasProfile] = useState(true);

  return (
    <div className="p-5">
      {hasProfile ? (
        <div className="space-y-5">
          {hasConnected ? (
            <div className="space-y-1">
              <div className="text-xl font-medium text-white">
                <Trans>Please sign the message</Trans>.
              </div>
              <div className="lt-text-gray-500 text-sm">
                <Trans>{APP_NAME} uses this signature to verify that you're the owner of this address.</Trans>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="font-medium text-white">
                <Trans>Connect your wallet</Trans>.
              </div>
              <div className="lt-text-gray-500 text-sm">
                <Trans>Connect with one of our available wallet providers or create a new one.</Trans>
              </div>
            </div>
          )}
          <WalletSelector setHasConnected={setHasConnected} setHasProfile={setHasProfile} />
        </div>
      ) : IS_MAINNET ? (
        <div className="mb-2 space-y-4">
          <div className="text-xl font-medium text-white">Claim your Lens profile 🌿</div>
          <div className="space-y-1">
            <div className="linkify text-white">
              Visit{' '}
              <a
                className="font-medium"
                href="https://claim.lens.xyz"
                target="_blank"
                rel="noreferrer noopener"
              >
                claiming site
              </a>{' '}
              to claim your profile now 🏃‍♂️
            </div>
            <div className="lt-text-gray-500 text-sm">Make sure to check back here when done!</div>
          </div>
        </div>
      ) : (
        <NewProfile isModal />
      )}
    </div>
  );
};

export default Login;
