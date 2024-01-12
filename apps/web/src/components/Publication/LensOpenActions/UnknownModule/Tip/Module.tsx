import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import {
  type MirrorablePublication,
  type UnknownOpenActionModuleSettings,
  useModuleMetadataQuery
} from '@hey/lens';
import { Button } from '@hey/ui';
import useActOnUnknownOpenAction from 'src/hooks/useActOnUnknownOpenAction';
import { encodeAbiParameters } from 'viem';

interface TipOpenActionModuleProps {
  module: UnknownOpenActionModuleSettings;
  publication: MirrorablePublication;
}

const TipOpenActionModule: FC<TipOpenActionModuleProps> = ({
  module,
  publication
}) => {
  const { data, loading } = useModuleMetadataQuery({
    skip: !Boolean(module?.contract.address),
    variables: { request: { implementation: module?.contract.address } }
  });

  const metadata = data?.moduleMetadata?.metadata;

  const { actOnUnknownOpenAction } = useActOnUnknownOpenAction({
    abi: metadata?.processCalldataABI,
    address: module.contract.address,
    onCompleted: () => {},
    onError: () => {}
  });

  if (loading) {
    return (
      <div className="m-5">
        <Loader message="Loading tip..." />
      </div>
    );
  }

  const act = async () => {
    const abi = JSON.parse(metadata?.processCalldataABI ?? []);

    console.log('abi', abi);

    const calldata = encodeAbiParameters(abi, [
      '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
      '1'
    ]);

    await actOnUnknownOpenAction({
      address: module.contract.address,
      data: calldata,
      publicationId: publication.id
    });
  };

  return (
    <div className="p-5">
      <Button onClick={act}>Send</Button>
    </div>
  );
};

export default TipOpenActionModule;
