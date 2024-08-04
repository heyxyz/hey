import type { FC } from 'react';

import { Card, H5 } from '@hey/ui';

import WalletSelector from '../Auth/WalletSelector';

const WrongWallet: FC = () => {
  return (
    <Card className="linkify space-y-2 p-5">
      <div className="space-y-3 pb-2">
        <H5>Switch to correct wallet</H5>
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
