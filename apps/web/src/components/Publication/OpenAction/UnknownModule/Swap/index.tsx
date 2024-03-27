import type {
  MirrorablePublication,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { FC } from 'react';
import type { Address } from 'viem';

import Loader from '@components/Shared/Loader';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { REWARDS_ADDRESS, WMATIC_ADDRESS } from '@hey/data/constants';
import { useModuleMetadataQuery } from '@hey/lens';
import { Card } from '@hey/ui';
import errorToast from '@lib/errorToast';
import isFeatureAvailable from '@lib/isFeatureAvailable';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CHAIN } from 'src/constants';
import useTokenMetadata from 'src/hooks/alchemy/useTokenMetadata';
import useActOnUnknownOpenAction from 'src/hooks/useActOnUnknownOpenAction';
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

interface SwapOpenActionProps {
  module: UnknownOpenActionModuleSettings;
  publication: MirrorablePublication;
}

const SwapOpenAction: FC<SwapOpenActionProps> = ({ module, publication }) => {
  const [value, setValue] = useState<number>(0);
  const { address } = useAccount();

  const { data, loading } = useModuleMetadataQuery({
    skip: !Boolean(module?.contract.address),
    variables: { request: { implementation: module?.contract.address } }
  });

  const metadata = data?.moduleMetadata?.metadata;

  const decoded = decodeAbiParameters(
    JSON.parse(metadata?.initializeCalldataABI || '{}'),
    module.initializeCalldata
  );
  const outputTokenAddress = decoded[4];

  const { data: targetToken } = useTokenMetadata({
    address: outputTokenAddress,
    chain: CHAIN.id,
    enabled: outputTokenAddress !== undefined
  });

  // Begin: Balance Check
  const { data: wmaticBalanceData } = useBalance({
    address,
    query: { refetchInterval: 8000 },
    token: WMATIC_ADDRESS
  });
  const wmaticBalance = wmaticBalanceData
    ? parseFloat(formatUnits(wmaticBalanceData.value, 18)).toFixed(2)
    : 0;

  const { data: outputTokenBalanceData } = useBalance({
    address,
    query: { refetchInterval: 8000 },
    token: outputTokenAddress
  });
  const outputTokenBalance = outputTokenBalanceData
    ? parseFloat(
        formatUnits(outputTokenBalanceData.value, targetToken?.decimals || 18)
      ).toFixed(2)
    : 0;
  // End: Balance Check

  const { actOnUnknownOpenAction, isLoading } = useActOnUnknownOpenAction({
    signlessApproved: module.signlessApproved,
    successToast: "You've successfully swapped!"
  });

  if (!isFeatureAvailable('swap-oa')) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <Loader className="p-5" message="Loading swap open action..." small />
      </Card>
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

    try {
      await actOnUnknownOpenAction({
        address: module.contract.address,
        data: calldata,
        publicationId: publication.id
      });
      setValue(0);

      return;
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <div className="max-w-sm space-y-5">
      <Card forceRounded>
        <div className="flex items-center justify-between">
          <input
            className="no-spinner ml-2 w-6/12 max-w-lg border-none py-5 text-xl outline-none focus:ring-0"
            onChange={(e) => setValue(Number(e.target.value))}
            placeholder="0"
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
            <div className="text-xs">Balance: {wmaticBalance}</div>
          </div>
        </div>
        <div className="divider" />
        <div className="flex items-center justify-between">
          <input
            className="no-spinner ml-2 w-6/12 max-w-lg border-none py-5 text-xl outline-none focus:ring-0"
            disabled
            placeholder="0"
            type="number"
          />
          <div className="mr-5 flex flex-col items-end space-y-0.5">
            <div className="flex items-center space-x-1.5">
              {targetToken?.logo ? (
                <img
                  alt={targetToken?.symbol || 'Symbol'}
                  className="size-5 rounded-full"
                  src={targetToken.logo}
                />
              ) : (
                <CurrencyDollarIcon className="size-5" />
              )}
              <b>{targetToken?.symbol}</b>
            </div>
            <div className="text-xs">Balance: {outputTokenBalance}</div>
          </div>
        </div>
      </Card>
      <ActionButton
        act={act}
        className="w-full"
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
