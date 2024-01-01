import type { FC } from 'react';

import Signup from '@components/Shared/Login/New';
import WalletSelector from '@components/Shared/Login/WalletSelector';
import { APP_NAME } from '@hey/data/constants';
import { useState } from 'react';

const Login: FC = () => {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="p-5">
      {showSignup ? (
        <div>
          <div className="mb-5 space-y-1">
            <div className="text-xl font-bold">Create testnet profile.</div>
            <div className="ld-text-gray-500 text-sm">
              Create a new profile on the {APP_NAME} testnet.
            </div>
          </div>
          <Signup />
        </div>
      ) : (
        <WalletSelector setShowSignup={setShowSignup} />
      )}
    </div>
  );
};

export default Login;
