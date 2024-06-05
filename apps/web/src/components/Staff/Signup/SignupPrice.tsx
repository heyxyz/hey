import type { FC } from 'react';

import { HeyLensSignup } from '@hey/abis';
import { HEY_LENS_SIGNUP } from '@hey/data/constants';
import { NumberedStat } from '@hey/ui';
import { useReadContract } from 'wagmi';

const SignupPrice: FC = () => {
  const { data } = useReadContract({
    abi: HeyLensSignup,
    address: HEY_LENS_SIGNUP,
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
