import type { FC } from 'react';

import { GoodLensSignup } from '@good/abis';
import { GOOD_LENS_SIGNUP } from '@good/data/constants';
import { NumberedStat } from '@good/ui';
import { useReadContract } from 'wagmi';

const SignupPrice: FC = () => {
  const { data } = useReadContract({
    abi: GoodLensSignup,
    address: GOOD_LENS_SIGNUP,
    functionName: 'signupPrice',
    query: { refetchInterval: 10000 }
  });

  const price = data?.toString();
  const priceInMatic = price ? Number(price) / 10 ** 18 : 0;

  return (
    <NumberedStat
      count={priceInMatic.toString() || '0'}
      name={`Signup Price`}
      suffix="MATIC / profile"
    />
  );
};

export default SignupPrice;
