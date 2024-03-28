import type {
  MirrorablePublication,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { UniswapQuote } from '@hey/types/hey';
import type { FC } from 'react';
import type { Address } from 'viem';

import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import {
  KNOWN_ATTRIBUTES,
  REWARDS_ADDRESS,
  WMATIC_ADDRESS
} from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import { useModuleMetadataQuery } from '@hey/lens';
import getPublicationAttribute from '@hey/lib/getPublicationAttribute';
import getUniswapQuote from '@hey/lib/getUniswapQuote';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Card } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { CHAIN } from 'src/constants';
import useTokenMetadata from 'src/hooks/alchemy/useTokenMetadata';
import useActOnUnknownOpenAction from 'src/hooks/useActOnUnknownOpenAction';
import usePreventScrollOnNumberInput from 'src/hooks/usePreventScrollOnNumberInput';
import {
  concat,
  decodeAbiParameters,
  encodeAbiParameters,
  formatUnits,
  pad,
  parseEther,
  toBytes,
  toHex
} from 'viem';
import { useAccount, useBalance } from 'wagmi';

import ActionButton from '../ActionButton';
import Details from './Details';

interface SwapOpenActionProps {
  module: UnknownOpenActionModuleSettings;
  publication?: MirrorablePublication;
}

const SwapOpenAction: FC<SwapOpenActionProps> = ({ module, publication }) => {
  const [value, setValue] = useState<number>(0);
  const [quote, setQuote] = useState<null | UniswapQuote>(null);
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false);
  const [canSwap, setCanSwap] = useState<boolean>(false);
  const { address } = useAccount();

  const inputRef = useRef<HTMLInputElement>(null);
  usePreventScrollOnNumberInput(inputRef);

  const { data: moduleMetadata, loading: moduleMetadataLoading } =
    useModuleMetadataQuery({
      skip: !Boolean(module?.contract.address),
      variables: { request: { implementation: module?.contract.address } }
    });

  const oADefaultAmount = getPublicationAttribute(
    publication?.metadata.attributes,
    KNOWN_ATTRIBUTES.SWAP_OA_DEFAULT_AMOUNT
  );
  const metadata = moduleMetadata?.moduleMetadata?.metadata;

  useEffect(() => {
    if (oADefaultAmount) {
      setValue(Number(oADefaultAmount));
    }
  }, [oADefaultAmount]);

  const decoded = decodeAbiParameters(
    JSON.parse(metadata?.initializeCalldataABI || '{}'),
    module.initializeCalldata
  );
  const outputTokenAddress = decoded[4];

  const { data: outTokenMetadata, loading: outTokenMetadataLoading } =
    useTokenMetadata({
      address: outputTokenAddress,
      chain: CHAIN.id,
      enabled: outputTokenAddress !== undefined
    });

  // Begin: Balance Check
  const { data: wmaticBalanceData, isLoading: wmaticBalanceLoading } =
    useBalance({
      address,
      query: { refetchInterval: 8000 },
      token: WMATIC_ADDRESS
    });
  const wmaticBalance = wmaticBalanceData
    ? parseFloat(formatUnits(wmaticBalanceData.value, 18)).toFixed(2)
    : 0;

  const { data: outputTokenBalanceData, isLoading: outputTokenBalanceLoading } =
    useBalance({
      address,
      query: { refetchInterval: 8000 },
      token: outputTokenAddress
    });
  const outputTokenBalance = outputTokenBalanceData
    ? parseFloat(
        formatUnits(
          outputTokenBalanceData.value,
          outTokenMetadata?.decimals || 18
        )
      ).toFixed(2)
    : 0;
  // End: Balance Check

  const { actOnUnknownOpenAction, isLoading } = useActOnUnknownOpenAction({
    onSuccess: () => {
      setValue(0);
      setQuote(null);
      Leafwatch.track(PUBLICATION.OPEN_ACTIONS.SWAP.SWAP, {
        publication_id: publication?.id
      });
    },
    signlessApproved: module.signlessApproved,
    successToast: "You've successfully swapped!"
  });

  useEffect(() => {
    if (value > 0 && outputTokenAddress) {
      setQuoteLoading(true);
      getUniswapQuote(WMATIC_ADDRESS, outputTokenAddress, value, CHAIN.id)
        .then((quote) => {
          setCanSwap(true);
          setQuote(quote);
        })
        .catch(() => setCanSwap(false))
        .finally(() => setQuoteLoading(false));
    } else {
      setCanSwap(false);
      setQuote(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, outputTokenAddress]);

  if (
    moduleMetadataLoading ||
    outTokenMetadataLoading ||
    wmaticBalanceLoading ||
    outputTokenBalanceLoading
  ) {
    return (
      <div className="w-[23rem]">
        <div className="shimmer h-[68.8px] rounded-t-xl" />
        <div className="shimmer mt-[1px] h-[68.8px] rounded-b-xl" />
        <div className="shimmer mt-5 h-[34px] w-full rounded-full" />
      </div>
    );
  }

  const act = async () => {
    if (value === 0) {
      return toast.error('Please enter a valid amount');
    }

    const abi = JSON.parse(metadata?.processCalldataABI);

    const inputTokenAddress = toBytes(WMATIC_ADDRESS);
    const tokenAddress = toBytes(outputTokenAddress);
    const fee = toBytes(pad(toHex(10000), { size: 3 }));
    const path = concat([inputTokenAddress, fee, tokenAddress]);

    const data = {
      amountIn: parseEther(value?.toString() || '0'),
      amountOutMinimum: 0n,
      clientAddress: REWARDS_ADDRESS as Address,
      deadline: BigInt(Math.floor(Date.now() / 1000) + 20 * 60),
      path
    };

    const calldata = encodeAbiParameters(abi, [
      toHex(data.path),
      data.deadline,
      data.amountIn,
      data.amountOutMinimum,
      data.clientAddress
    ]);

    if (!publication) {
      return toast.success('Publish this publication to swap!');
    }

    try {
      return await actOnUnknownOpenAction({
        address: module.contract.address,
        data: calldata,
        publicationId: publication.id
      });
    } catch (error) {
      errorToast(error);
    }
  };

  const inputClassName =
    'no-spinner ml-2 w-6/12 max-w-lg border-none py-5 text-xl outline-none focus:ring-0';

  return (
    <div className="w-fit max-w-sm space-y-5" onClick={stopEventPropagation}>
      <Card forceRounded>
        <div className="flex items-center justify-between">
          <input
            className={inputClassName}
            inputMode="numeric"
            onChange={(e) => {
              // @ts-ignore
              setValue(e.target.value);
            }}
            placeholder="0"
            ref={inputRef}
            type="number"
            value={value || ''}
          />
          <div className="mr-5 flex flex-col items-end space-y-0.5">
            <div className="flex items-center space-x-1.5">
              <img
                alt="WMATIC"
                className="size-5 rounded-full"
                src="https://hey-assets.b-cdn.net/images/tokens/wmatic.svg"
              />
              <b>WMATIC</b>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <div className="ld-text-gray-500">Balance: {wmaticBalance}</div>
              <button onClick={() => setValue(Number(wmaticBalance))}>
                Max
              </button>
            </div>
          </div>
        </div>
        <div className="divider" />
        <div className="flex items-center justify-between">
          <input
            className={inputClassName}
            disabled
            placeholder="0"
            type="number"
            value={quote?.amountOut || ''}
          />
          <div className="mr-5 flex flex-col items-end space-y-0.5">
            <div className="flex items-center space-x-1.5">
              {outTokenMetadata?.logo ? (
                <img
                  alt={outTokenMetadata?.symbol || 'Symbol'}
                  className="size-5 rounded-full"
                  src={outTokenMetadata.logo}
                />
              ) : (
                <CurrencyDollarIcon className="size-5" />
              )}
              <b>{outTokenMetadata?.symbol}</b>
            </div>
            <div className="ld-text-gray-500 text-xs">
              Balance: {outputTokenBalance}
            </div>
          </div>
        </div>
      </Card>
      {outTokenMetadata ? (
        <Details
          calculatedQuote={quote}
          decodedCallData={decoded}
          tokenMetadata={outTokenMetadata}
          value={value}
        />
      ) : null}
      <ActionButton
        act={act}
        className="w-full"
        isLoading={isLoading || quoteLoading || !canSwap}
        module={module}
        moduleAmount={{
          asset: {
            contract: { address: WMATIC_ADDRESS, chainId: CHAIN.id },
            decimals: 18,
            name: 'WMATIC',
            symbol: 'WMATIC'
          },
          value: value.toString()
        }}
        title="Swap"
      />
    </div>
  );
};

export default SwapOpenAction;
