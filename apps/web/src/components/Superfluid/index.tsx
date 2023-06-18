import type { Profile } from '@lenster/lens';
import { Button } from '@lenster/ui';
import { t } from '@lingui/macro';
import * as React from 'react';

import tokenList from '../../../node_modules/@superfluid-finance/tokenlist';
import SuperfluidWidget from '../../../node_modules/@superfluid-finance/widget';
import paymentDetails from './paymentDetails';

interface SuperfluidSubscribeProps {
  profile: Profile;
}

export function SuperfluidSubscribe({ profile }: SuperfluidSubscribeProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const walletManager = {
    open: async () => setIsOpen(true),
    isOpen: isOpen
  };

  const customPaymentDetails = paymentDetails.paymentOptions.map((option) => {
    return {
      ...option,
      receiverAddress: profile.ownedBy
    };
  });

  return (
    <div>
      <SuperfluidWidget
        productDetails={{
          name: 'Superfluid Subscription | ' + profile.name,
          description:
            profile.bio || "Subscribe to this creator's Superfluid stream"
        }}
        paymentDetails={{
          paymentOptions: customPaymentDetails
        }}
        tokenList={tokenList}
        type="dialog"
        walletManager={walletManager}
      >
        {({ openModal }) => (
          <Button
            type="button"
            onClick={() => openModal()}
            className="w-full px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            {t`Subscribe $`}
          </Button>
          // <Button
          //   className="!px-3 !py-1 text-sm"
          //   outline
          //   onClick={() => openModal()}
          //   variant="super"
          //   aria-label="Subscribe"
          //   icon={<UserRemoveIcon className="w-4 h-4" />}
          // >
          //   {t`Subscribe`}
          // </Button>
        )}
      </SuperfluidWidget>
    </div>
  );
}

export default SuperfluidSubscribe;
