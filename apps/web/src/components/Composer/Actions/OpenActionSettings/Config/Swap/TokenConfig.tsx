import type { UniswapQuote } from '@hey/types/hey';
import type { FC } from 'react';
import type { Address } from 'viem';

import { WMATIC_ADDRESS } from '@hey/data/constants';
import getUniswapQuote from '@hey/helpers/getUniswapQuote';
import { Input } from '@hey/ui';
import { useEffect, useState } from 'react';
import { CHAIN } from 'src/constants';
import { isAddress } from 'viem';

import { useSwapActionStore } from '.';

const TokenConfig: FC = () => {
  const { setCanSwap, setDecimals, setSymbol, setToken, token } =
    useSwapActionStore();
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
          setSymbol(quote?.route.tokenOut.symbol);
          setDecimals(parseInt(quote?.route.tokenOut.decimals));
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
    <div className="mt-5 text-sm">
      <Input
        disabled={quoteLoading}
        error={!isAddress(token as Address)}
        label={
          <div className="flex items-center space-x-2">
            <span>Token address (Polygon)</span>
            {quoteLoading ? null : quote ? (
              <span>
                <span className="mr-2">·</span>
                <span className="font-bold text-green-500">
                  {quote?.route.tokenOut.symbol}
                </span>
              </span>
            ) : token ? (
              <span>
                <span className="mr-2">·</span>
                <span className="font-bold text-red-500">
                  No Uniswap Pools Available
                </span>
              </span>
            ) : null}
          </div>
        }
        min="1"
        onChange={(event) => {
          setToken(event.target.value as Address);
        }}
        placeholder="0x..."
        value={token as Address}
      />
    </div>
  );
};

export default TokenConfig;
