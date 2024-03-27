import type { UniswapQuote } from '@hey/types/hey';
import type { TokenMetadataResponse } from 'alchemy-sdk';

import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { HEY_API_URL, WMATIC_ADDRESS } from '@hey/data/constants';
import { Card, HelpTooltip } from '@hey/ui';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import axios from 'axios';
import { type FC, useEffect, useState } from 'react';
import { parseUnits } from 'viem';

interface DetailsProps {
  decimals: number;
  decodedCallData: any[];
  tokenMetadata: TokenMetadataResponse;
  value: number;
}

const Details: FC<DetailsProps> = ({
  decimals,
  decodedCallData,
  tokenMetadata,
  value
}) => {
  const [quote, setQuote] = useState<null | UniswapQuote>(null);
  const token = decodedCallData[4];

  const getSwapQuote = async (): Promise<UniswapQuote> => {
    const response = await axios.post(
      `${HEY_API_URL}/openaction/swap/quote`,
      {
        amount: parseUnits('1', decimals).toString(),
        tokenIn: WMATIC_ADDRESS,
        tokenOut: token
      },
      { headers: getAuthApiHeaders() }
    );
    const { data } = response;

    return data?.quote;
  };

  useEffect(() => {
    if (value > 0) {
      getSwapQuote().then((quote) => setQuote(quote));
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
                <div>{quote.maxSlippage}%</div>
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
                  <HelpTooltip>{quote.routeString}</HelpTooltip>
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
