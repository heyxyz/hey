import type { FC } from 'react';

import { Card } from '@hey/ui';

import WalletSelector from '../Auth/WalletSelector';

const WrongWallet: FC = () => {
  return (
    <Card className="linkify space-y-2 p-5">
      <div className="space-y-3 pb-2">
        <div className="text-lg font-bold">Switch to correct wallet</div>
        <p>
          You need to switch to correct wallet to manage this profile. Please
          switch to the correct wallet to manage this profile.
        </p>
      </div>
      <WalletSelector />
    </Card>
  );
};

export default WrongWallet;
