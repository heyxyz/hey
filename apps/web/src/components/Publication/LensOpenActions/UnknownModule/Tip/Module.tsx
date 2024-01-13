import type {
  MirrorablePublication,
  Profile,
  UnknownOpenActionModuleSettings
} from '@hey/lens';

import Loader from '@components/Shared/Loader';
import SmallUserProfile from '@components/Shared/SmallUserProfile';
import { DEFAULT_COLLECT_TOKEN } from '@hey/data/constants';
import { useDefaultProfileQuery, useModuleMetadataQuery } from '@hey/lens';
import getAllTokens from '@hey/lib/api/getAllTokens';
import getAssetSymbol from '@hey/lib/getAssetSymbol';
import getRedstonePrice from '@hey/lib/getRedstonePrice';
import { Button, RangeSlider, Select } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';
import useActOnUnknownOpenAction from 'src/hooks/useActOnUnknownOpenAction';
import { decodeAbiParameters, encodeAbiParameters, parseUnits } from 'viem';

interface TipOpenActionModuleProps {
  module: UnknownOpenActionModuleSettings;
  publication: MirrorablePublication;
}

const TipOpenActionModule: FC<TipOpenActionModuleProps> = ({
  module,
  publication
}) => {
  const [tip, setTip] = useState({
    currency: DEFAULT_COLLECT_TOKEN,
    value: [5]
  });

  const { data, loading } = useModuleMetadataQuery({
    skip: !Boolean(module?.contract.address),
    variables: { request: { implementation: module?.contract.address } }
  });

  const metadata = data?.moduleMetadata?.metadata;
  const decoded = decodeAbiParameters(
    JSON.parse(metadata?.initializeCalldataABI ?? '{}'),
    module?.initializeCalldata
  );

  const { actOnUnknownOpenAction } = useActOnUnknownOpenAction({
    onCompleted: () => {},
    onError: () => {}
  });

  const { data: allowedTokens, isLoading: loadingAllowedTokens } = useQuery({
    queryFn: () => getAllTokens(),
    queryKey: ['getAllTokens']
  });

  const { data: profile, loading: loadingProfile } = useDefaultProfileQuery({
    skip: !Boolean(decoded[0]),
    variables: { request: { for: decoded[0] } }
  });

  if (loading || loadingAllowedTokens) {
    return (
      <div className="m-5">
        <Loader message="Loading tip..." />
      </div>
    );
  }

  const act = async () => {
    const abi = JSON.parse(metadata?.processCalldataABI);
    const currency = allowedTokens?.find(
      (token) => token.contractAddress === tip.currency
    );

    if (!currency) {
      return toast.error('Currency not supported');
    }

    const amount = tip.value[0];
    const usdPrice = await getRedstonePrice(getAssetSymbol(currency.symbol));
    const usdValue = amount * usdPrice;

    const calldata = encodeAbiParameters(abi, [
      currency.contractAddress,
      parseUnits(usdValue.toString(), currency.decimals).toString()
    ]);

    await actOnUnknownOpenAction({
      address: module.contract.address,
      data: calldata,
      publicationId: publication.id
    });
  };

  return (
    <div className="space-y-3 p-5">
      {profile ? (
        <SmallUserProfile profile={profile.defaultProfile as Profile} />
      ) : null}
      <div className="flex items-center space-x-2">
        <RangeSlider
          min={1}
          onValueChange={(value) => setTip({ ...tip, value })}
          value={tip.value}
        />
        <div className="w-2/6">
          <Select
            defaultValue={DEFAULT_COLLECT_TOKEN}
            onChange={(e) => setTip({ ...tip, currency: e.target.value })}
            options={allowedTokens?.map((token) => ({
              label: token.symbol,
              value: token.contractAddress
            }))}
          />
        </div>
      </div>
      <Button onClick={act}>Send</Button>
    </div>
  );
};

export default TipOpenActionModule;
