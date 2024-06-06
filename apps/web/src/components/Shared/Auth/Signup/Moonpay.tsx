import type { FC } from 'react';

import { MOONPAY_URL } from '@good/data/constants';
import { Button } from '@good/ui';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import urlcat from 'urlcat';
import { useAccount } from 'wagmi';

interface MoonpayProps {
  disabled: boolean;
}

const Moonpay: FC<MoonpayProps> = ({ disabled }) => {
  const { address } = useAccount();

  const handleBuy = () => {
    return window.open(
      urlcat(MOONPAY_URL, {
        currencyCode: 'MATIC',
        redirectURL: window.location.href,
        walletAddress: address
      }),
      '_blank'
    );
  };

  return (
    <Button
      className="w-full justify-center"
      disabled={disabled}
      icon={<CurrencyDollarIcon className="size-5" />}
      onClick={handleBuy}
    >
      Buy MATIC
    </Button>
  );
};

export default Moonpay;
