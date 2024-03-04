import Login from '@components/Shared/Auth/Login';
import { APP_NAME } from '@hey/data/constants';
import { type FC, useState } from 'react';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useAccount } from 'wagmi';

import Signup from './Signup';

const NotConnected = () => (
  <div className="space-y-2">
    <div className="text-xl font-bold">Connect your wallet.</div>
    <div className="ld-text-gray-500 text-sm">
      Connect with one of our available wallet providers or create a new one.
    </div>
  </div>
);

const Auth: FC = () => {
  const authModalType = useGlobalModalStateStore(
    (state) => state.authModalType
  );
  const [hasProfiles, setHasProfiles] = useState(false);
  const { isConnected } = useAccount();

  return (
    <div className="m-5">
      {authModalType === 'signup' ? (
        <div className="space-y-5">
          {!isConnected && <NotConnected />}
          <Signup />
        </div>
      ) : (
        <div className="space-y-5">
          {isConnected ? (
            hasProfiles ? (
              <div className="space-y-2">
                <div className="text-xl font-bold">
                  Please sign the message.
                </div>
                <div className="ld-text-gray-500 text-sm">
                  {APP_NAME} uses this signature to verify that you're the owner
                  of this address.
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xl font-bold">Signup to {APP_NAME}.</div>
                <div className="ld-text-gray-500 text-sm">
                  Create a new profile on Lens Protocol {APP_NAME}.
                </div>
              </div>
            )
          ) : (
            <NotConnected />
          )}
          <Login setHasProfiles={setHasProfiles} />
        </div>
      )}
    </div>
  );
};

export default Auth;
