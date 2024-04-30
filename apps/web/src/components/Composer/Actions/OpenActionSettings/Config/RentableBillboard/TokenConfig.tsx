import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { Select } from '@hey/ui';
import { type FC } from 'react';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokensStore';

import { useRentableBillboardActionStore } from '.';

const TokenConfig: FC = () => {
  const { setToken, token: currency } = useRentableBillboardActionStore();
  const { allowedTokens } = useAllowedTokensStore();

  return (
    <div className="mt-5">
      <div className="label">Select currency</div>
      <Select
        iconClassName="size-4"
        onChange={(value) => setToken(value)}
        options={allowedTokens?.map((token) => ({
          icon: `${STATIC_IMAGES_URL}/tokens/${token.symbol}.svg`,
          label: token.name,
          selected: token.contractAddress === currency,
          value: token.contractAddress
        }))}
      />
    </div>
  );
};

export default TokenConfig;
