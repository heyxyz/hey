import type { UniswapQuote } from '@hey/types/hey';

import { WMATIC_ADDRESS } from '@hey/data/constants';
import getUniswapQuote from '@hey/lib/getUniswapQuote';
import { Input } from '@hey/ui';
import { type FC, useEffect, useState } from 'react';
import { CHAIN } from 'src/constants';
import { type Address, isAddress } from 'viem';

import { useSwapActionStore } from '.';

const TokenConfig: FC = () => {
  const { setCanSwap, setToken, token } = useSwapActionStore();
  const [quote, setQuote] = useState<null | UniswapQuote>(null);
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      setCanSwap(false);
      setQuoteLoading(true);
      getUniswapQuote(WMATIC_ADDRESS, token, 1, CHAIN.id)
        .then((quote) => {
          setCanSwap(true);
          setQuote(quote);
        })
        .catch(() => {
          setQuote(null);
          setCanSwap(false);
        })
        .finally(() => setQuoteLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="text-sm">
      <Input
        disabled={quoteLoading}
        error={!isAddress(token)}
        label="Token address (Polygon)"
        min="1"
        onChange={(event) => {
          setToken(event.target.value as Address);
        }}
        placeholder="0x..."
        value={token}
      />
      {quoteLoading ? null : quote ? (
        <div className="mt-1 font-bold text-green-500">
          {quote?.route.tokenOut.symbol}
        </div>
      ) : token ? (
        <div className="mt-1 font-bold text-red-500">
          No Uniswap Pools Available
        </div>
      ) : null}
    </div>
  );
};

export default TokenConfig;
