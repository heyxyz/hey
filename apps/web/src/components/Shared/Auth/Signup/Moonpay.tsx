import { MOONPAY_URL, SIGNUP_PRICE } from '@hey/data/constants';
import { Button } from '@hey/ui';
import { type FC } from 'react';
import urlcat from 'urlcat';
import { useAccount } from 'wagmi';

interface MoonpayProps {
  balance?: number;
}

const Moonpay: FC<MoonpayProps> = ({ balance }) => {
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
    <div className="pt-5">
      {balance ? (
        <div className="ld-text-gray-500 mb-2 text-sm">
          You need <b>{SIGNUP_PRICE} MATIC</b> to get your profile. You have
          only <b>{balance.toFixed(2)} MATIC</b>.
        </div>
      ) : null}
      <Button className="w-full" onClick={handleBuy}>
        Buy MATIC
      </Button>
    </div>
  );
};

export default Moonpay;
