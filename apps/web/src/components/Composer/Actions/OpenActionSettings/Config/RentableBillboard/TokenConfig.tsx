import type { FC } from 'react';
import type { Address } from 'viem';

import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { Select } from '@hey/ui';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokensStore';

import { useRentableBillboardActionStore } from '.';

const TokenConfig: FC = () => {
  const { currency, setCurrency } = useRentableBillboardActionStore();
  const { allowedTokens } = useAllowedTokensStore();

  return (
    <div className="mt-5">
      <div className="label">Select currency</div>
      <Select
        iconClassName="size-4"
        onChange={(value) => {
          setCurrency(
            value as Address,
            allowedTokens?.find((t) => t.symbol === value)?.decimals || 18
          );
        }}
        options={allowedTokens?.map((token) => ({
          icon: `${STATIC_IMAGES_URL}/tokens/${token.symbol}.svg`,
          label: token.name,
          selected: token.contractAddress === currency.token,
          value: token.contractAddress
        }))}
      />
    </div>
  );
};

export default TokenConfig;
