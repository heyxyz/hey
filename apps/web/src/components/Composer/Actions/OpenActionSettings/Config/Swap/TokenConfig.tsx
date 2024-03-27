import type { FC } from 'react';

import { Input } from '@hey/ui';
import { CHAIN } from 'src/constants';
import useTokenMetadata from 'src/hooks/alchemy/useTokenMetadata';
import { type Address, isAddress } from 'viem';

import { useSwapActionStore } from '.';

const TokenConfig: FC = () => {
  const { setToken, token } = useSwapActionStore();

  const { data } = useTokenMetadata({
    address: token,
    chain: CHAIN.id,
    enabled: token !== undefined && isAddress(token)
  });

  return (
    <div className="text-sm">
      <Input
        error={!isAddress(token)}
        label="Token address (Polygon)"
        min="1"
        onChange={(event) => {
          setToken(event.target.value as Address);
        }}
        placeholder="0x..."
        value={token}
      />
      {data ? (
        <div className="mt-1 font-bold text-green-500">
          {data.name} ({data.symbol})
        </div>
      ) : null}
    </div>
  );
};

export default TokenConfig;
