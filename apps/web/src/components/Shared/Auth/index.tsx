import type { FC } from 'react';

import Login from '@components/Shared/Auth/Login';
import { APP_NAME } from '@hey/data/constants';
import { useState } from 'react';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { useAccount } from 'wagmi';

import AuthMessage from './AuthMessage';
import Signup from './Signup';
import { SignupMessage } from './Signup/ChooseHandle';

const NotConnected = () => (
  <AuthMessage
    description="Connect with one of our available wallet providers or create a new one."
    title="Connect your wallet."
  />
);

const Auth: FC = () => {
  const { authModalType } = useGlobalModalStateStore();
  const [hasProfiles, setHasProfiles] = useState(true);
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
              <AuthMessage
                description={`${APP_NAME} uses this signature to verify that you're the owner of this address.`}
                title="Please sign the message."
              />
            ) : (
              <SignupMessage />
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
