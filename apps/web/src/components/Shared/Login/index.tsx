import WalletSelector from '@components/Shared/Login/WalletSelector';
import { APP_NAME } from '@lenster/data/constants';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';

const Login: FC = () => {
  const [hasConnected, setHasConnected] = useState(false);

  return (
    <div className="p-5">
      <div className="space-y-5">
        {hasConnected ? (
          <div className="space-y-1">
            <div className="text-xl font-bold">
              <Trans>Please sign the message</Trans>.
            </div>
            <div className="lt-text-gray-500 text-sm">
              <Trans>
                {APP_NAME} uses this signature to verify that you're the owner
                of this address.
              </Trans>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="text-xl font-bold">
              <Trans>Connect your wallet</Trans>.
            </div>
            <div className="lt-text-gray-500 text-sm">
              <Trans>
                Connect with one of our available wallet providers or create a
                new one.
              </Trans>
            </div>
          </div>
        )}
        <WalletSelector setHasConnected={setHasConnected} />
      </div>
    </div>
  );
};

export default Login;
