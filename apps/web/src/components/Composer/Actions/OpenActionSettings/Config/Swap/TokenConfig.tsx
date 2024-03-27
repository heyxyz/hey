import type { FC } from 'react';
import type { Address } from 'viem';

import { Input } from '@hey/ui';

import { useSwapActionStore } from '.';

const TokenConfig: FC = () => {
  const { setToken, token } = useSwapActionStore();

  return (
    <div className="text-sm">
      <Input
        label="Token address (Polygon)"
        min="1"
        onChange={(event) => {
          setToken(event.target.value as Address);
        }}
        placeholder="0x..."
        value={token}
      />
    </div>
  );
};

export default TokenConfig;
