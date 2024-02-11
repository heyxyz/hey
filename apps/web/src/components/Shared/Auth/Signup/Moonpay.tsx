import { MOONPAY_URL } from '@hey/data/constants';
import { Button } from '@hey/ui';
import { type FC } from 'react';
import urlcat from 'urlcat';
import { useAccount } from 'wagmi';

const Moonpay: FC = () => {
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
    <Button className="w-full" onClick={handleBuy}>
      Buy MATIC
    </Button>
  );
};

export default Moonpay;
