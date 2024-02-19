import type { FC } from 'react';

import Login from '@components/Shared/Auth/Login';
import { APP_NAME } from '@hey/data/constants';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useAccount } from 'wagmi';

import Signup from './Signup';

const Auth: FC = () => {
  const authModalType = useGlobalModalStateStore(
    (state) => state.authModalType
  );
  const { isConnected } = useAccount();

  return (
    <div className="m-5">
      {authModalType === 'signup' ? (
        <div className="space-y-5">
          {!isConnected && (
            <div className="space-y-2">
              <div className="text-xl font-bold">Connect your wallet.</div>
              <div className="ld-text-gray-500 text-sm">
                Connect with one of our available wallet providers or create a
                new one.
              </div>
            </div>
          )}
          <Signup />
        </div>
      ) : (
        <div className="space-y-5">
          {isConnected ? (
            <div className="space-y-2">
              <div className="text-xl font-bold">Please sign the message.</div>
              <div className="ld-text-gray-500 text-sm">
                {APP_NAME} uses this signature to verify that you're the owner
                of this address.
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-xl font-bold">Connect your wallet.</div>
              <div className="ld-text-gray-500 text-sm">
                Connect with one of our available wallet providers or create a
                new one.
              </div>
            </div>
          )}
          <Login />
        </div>
      )}
    </div>
  );
};

export default Auth;
