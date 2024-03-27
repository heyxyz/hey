import type { UniswapQuote } from '@hey/types/hey';
import type { TokenMetadataResponse } from 'alchemy-sdk';

import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { WMATIC_ADDRESS } from '@hey/data/constants';
import getUniswapQuote from '@hey/lib/getUniswapQuote';
import { Card, HelpTooltip } from '@hey/ui';
import { type FC, useEffect, useState } from 'react';
import { CHAIN } from 'src/constants';

interface DetailsProps {
  calculatedQuote: null | UniswapQuote;
  decodedCallData: any[];
  tokenMetadata: TokenMetadataResponse;
  value: number;
}

const Details: FC<DetailsProps> = ({
  calculatedQuote,
  decodedCallData,
  tokenMetadata,
  value
}) => {
  const [quote, setQuote] = useState<null | UniswapQuote>(null);
  const [quoteFetched, setQuoteFetched] = useState<boolean>(false);
  const token = decodedCallData[4];

  useEffect(() => {
    if (value > 0 && !quoteFetched) {
      getUniswapQuote(WMATIC_ADDRESS, token, 1, CHAIN.id).then((quote) => {
        setQuoteFetched(true);
        setQuote(quote);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!value || !quote) {
    return null;
  }

  const oneTokenValue = (Number(quote.amountOut) / value).toFixed(4);

  return (
    <Card className="ld-text-gray-500 text-sm" forceRounded>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="w-full px-5 py-3">
              <div className="flex items-center justify-between">
                <div>
                  1 WMATIC = {oneTokenValue} {tokenMetadata.symbol}
                </div>
                {open ? (
                  <ChevronUpIcon className="size-3" />
                ) : (
                  <ChevronDownIcon className="size-3" />
                )}
              </div>
            </Disclosure.Button>
            <Disclosure.Panel className="space-y-2 px-5 pb-3 pt-1">
              <div className="item flex justify-between">
                <div>Max. slippage</div>
                <div>{calculatedQuote?.maxSlippage || quote.maxSlippage}%</div>
              </div>
              <div className="item flex justify-between">
                <div className="flex items-center space-x-1">
                  <span>Referral fee</span>
                  <HelpTooltip>
                    <b>Receiver:</b> {decodedCallData[2]}
                  </HelpTooltip>
                </div>
                <div>{decodedCallData[1] / 100}%</div>
              </div>
              <div className="item flex justify-between">
                <div className="flex items-center space-x-1">
                  <span>Order Routing</span>
                  <HelpTooltip>
                    <div className="max-w-sm">
                      {calculatedQuote?.routeString || quote.routeString}
                    </div>
                  </HelpTooltip>
                </div>
                <div>Uniswap API</div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </Card>
  );
};

export default Details;
