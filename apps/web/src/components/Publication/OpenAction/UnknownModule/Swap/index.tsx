import type {
  MirrorablePublication,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { FC } from 'react';
import type { Address } from 'viem';

import Loader from '@components/Shared/Loader';
import { REWARDS_ADDRESS } from '@hey/data/constants';
import { useModuleMetadataQuery } from '@hey/lens';
import { Button, Card } from '@hey/ui';
import isFeatureAvailable from '@lib/isFeatureAvailable';
import useActOnUnknownOpenAction from 'src/hooks/useActOnUnknownOpenAction';
import {
  concat,
  decodeAbiParameters,
  encodeAbiParameters,
  pad,
  parseEther,
  toBytes,
  toHex
} from 'viem';

interface SwapOpenActionProps {
  module: UnknownOpenActionModuleSettings;
  publication: MirrorablePublication;
}

const SwapOpenAction: FC<SwapOpenActionProps> = ({ module, publication }) => {
  const { data, loading } = useModuleMetadataQuery({
    skip: !Boolean(module?.contract.address),
    variables: { request: { implementation: module?.contract.address } }
  });

  const metadata = data?.moduleMetadata?.metadata;

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

  const decoded = decodeAbiParameters(
    JSON.parse(metadata?.initializeCalldataABI || '{}'),
    module.initializeCalldata
  );

  const outputTokenAddress = decoded[4];

  const act = async () => {
    const abi = JSON.parse(metadata?.processCalldataABI);

    const inputTokenAddress = toBytes(
      '0x9c3c9283d3e44854697cd22d3faa240cfb032889'
    ); // WMATIC
    const tokenAddress = toBytes(outputTokenAddress);
    const fee = toBytes(pad(toHex(10000), { size: 3 }));
    const path = concat([inputTokenAddress, fee, tokenAddress]);

    const data = {
      amountIn: parseEther('0.00001'),
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

    return await actOnUnknownOpenAction({
      address: module.contract.address,
      data: calldata,
      publicationId: publication.id
    });
  };

  return (
    <div className="max-w-sm space-y-5">
      <Card forceRounded>
        <div className="flex items-center justify-between">
          <input
            className="no-spinner ml-2 w-8/12 max-w-lg border-none py-5 outline-none focus:ring-0"
            placeholder="0.00001"
            type="number"
          />
          <div className="mr-5">Token</div>
        </div>
        <div className="divider" />
        <div className="flex items-center justify-between">
          <input
            className="no-spinner ml-2 w-8/12 max-w-lg border-none py-5 outline-none focus:ring-0"
            disabled
            placeholder="0.00001"
            type="number"
          />
          <div className="mr-5">Token</div>
        </div>
      </Card>
      <Button className="w-full" disabled={isLoading} onClick={act}>
        Swap
      </Button>
    </div>
  );
};

export default SwapOpenAction;
