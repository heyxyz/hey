import { APP_NAME } from '@hey/data/constants';
import { Button, Input } from '@hey/ui';
import { type FC, useState } from 'react';

import { useSignupStore } from '.';

const ChooseHandle: FC = () => {
  const setScreen = useSignupStore((state) => state.setScreen);
  const [handle, setHandle] = useState<null | string>(null);

  const handleMint = () => {
    setScreen('minting');
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="text-xl font-bold">Welcome to {APP_NAME}!</div>
        <div className="ld-text-gray-500 text-sm">
          Let's start by buying your handle for you. Buying you say? Yep -
          handles cost a little bit of money to support the network and keep
          bots away
        </div>
      </div>
      <div className="space-y-5 pt-3">
        <Input
          onChange={(e) => setHandle(e.target.value)}
          placeholder="yourhandle"
          prefix="@lens/"
        />
        <Button className="w-full" onClick={handleMint}>
          Mint for 15 USD
        </Button>
      </div>
    </div>
  );
};

export default ChooseHandle;
