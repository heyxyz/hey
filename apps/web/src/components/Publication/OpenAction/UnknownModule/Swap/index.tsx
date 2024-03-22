import type {
  MirrorablePublication,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { FC } from 'react';

import { REWARDS_ADDRESS } from '@hey/data/constants';
import { useModuleMetadataQuery } from '@hey/lens';
import { Button, Card, Spinner } from '@hey/ui';
import isFeatureAvailable from '@lib/isFeatureAvailable';
import useActOnUnknownOpenAction from 'src/hooks/useActOnUnknownOpenAction';
import { encodeAbiParameters, encodePacked } from 'viem';

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
      <Card className="p-5">
        <div className="space-y-2 text-center text-sm font-bold">
          <Spinner className="mx-auto" size="sm" />
          <div>Loading swap open action...</div>
        </div>
      </Card>
    );
  }

  const act = async () => {
    const abi = JSON.parse(metadata?.processCalldataABI);

    const calldata = encodeAbiParameters(abi, [
      encodePacked(
        ['address', 'uint24', 'address'],
        [
          '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', // From
          10000, // Amount
          '0x83816640bf2bb88c96b13ae73d12e0135c2b4816' // To
        ]
      ),
      Math.floor(Date.now() / 1000) + 20 * 60,
      1000000000000000000,
      0,
      REWARDS_ADDRESS
    ]);

    return await actOnUnknownOpenAction({
      address: module.contract.address,
      data: calldata,
      publicationId: publication.id
    });
  };

  return (
    <Card className="space-y-3 p-5">
      <Button disabled={isLoading} onClick={act}>
        Act
      </Button>
    </Card>
  );
};

export default SwapOpenAction;
