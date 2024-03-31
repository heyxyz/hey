import type { UniswapQuote } from '@hey/types/hey';

import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { Card, HelpTooltip } from '@hey/ui';
import { type FC } from 'react';

interface DetailsProps {
  calculatedQuote: null | UniswapQuote;
  decodedCallData: any[];
  firstQuote: null | UniswapQuote;
  value: number;
}

const Details: FC<DetailsProps> = ({
  calculatedQuote,
  decodedCallData,
  firstQuote,
  value
}) => {
  if (!value || !firstQuote) {
    return null;
  }

  return (
    <Card className="ld-text-gray-500 text-sm" forceRounded>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="w-full px-5 py-3">
              <div className="flex items-center justify-between">
                <div>
                  1 WMATIC = {firstQuote.amountOut}{' '}
                  {firstQuote.route.tokenOut.symbol}
                </div>
                {open ? (
                  <ChevronUpIcon className="size-3" />
                ) : (
                  <ChevronDownIcon className="size-3" />
                )}
              </div>
            </Disclosure.Button>
            <Disclosure.Panel className="space-y-2 px-5 pb-3">
              <div className="divider" />
              <div className="item flex justify-between">
                <div>Max. slippage</div>
                <div>
                  {calculatedQuote?.maxSlippage || firstQuote.maxSlippage}%
                </div>
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
                      {calculatedQuote?.routeString || firstQuote.routeString}
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
