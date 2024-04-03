import type { UniswapQuote } from '@hey/types/hey';

import { WMATIC_ADDRESS } from '@hey/data/constants';
import getUniswapQuote from '@hey/lib/getUniswapQuote';
import { Input } from '@hey/ui';
import { type FC, useEffect, useState } from 'react';
import { CHAIN } from 'src/constants';
import { type Address, isAddress } from 'viem';

import { useSwapActionStore } from '.';

const TokenConfig: FC = () => {
  const { rewardsPoolId, setCanSwap, setToken, token } = useSwapActionStore();
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

  if (!token) {
    return null;
  }

  return (
    <div className="mt-5 text-sm">
      <Input
        disabled={quoteLoading}
        error={!isAddress(token)}
        label={
          <div className="flex items-center space-x-2">
            <span>Token address (Polygon)</span>
            {quoteLoading ? null : quote ? (
              <span className="font-bold text-green-500">
                {quote?.route.tokenOut.symbol}
              </span>
            ) : token ? (
              <span className="font-bold text-red-500">
                No Uniswap Pools Available
              </span>
            ) : null}
          </div>
        }
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
