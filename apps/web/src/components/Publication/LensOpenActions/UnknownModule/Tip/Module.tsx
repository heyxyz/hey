import type {
  MirrorablePublication,
  Profile,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { AllowedToken } from '@hey/types/hey';

import Loader from '@components/Shared/Loader';
import SmallUserProfileShimmer from '@components/Shared/Shimmer/SmallUserProfileShimmer';
import SmallUserProfile from '@components/Shared/SmallUserProfile';
import WalletProfile from '@components/Shared/WalletProfile';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { DEFAULT_COLLECT_TOKEN } from '@hey/data/constants';
import { useDefaultProfileQuery, useModuleMetadataQuery } from '@hey/lens';
import getAllTokens from '@hey/lib/api/getAllTokens';
import getAssetSymbol from '@hey/lib/getAssetSymbol';
import getRedstonePrice from '@hey/lib/getRedstonePrice';
import { RangeSlider, Select } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import { type FC, useState } from 'react';
import toast from 'react-hot-toast';
import { CHAIN } from 'src/constants';
import useActOnUnknownOpenAction from 'src/hooks/useActOnUnknownOpenAction';
import { decodeAbiParameters, encodeAbiParameters, parseUnits } from 'viem';

import TipAction from './TipAction';

interface TipOpenActionModuleProps {
  module: UnknownOpenActionModuleSettings;
  publication: MirrorablePublication;
}

const TipOpenActionModule: FC<TipOpenActionModuleProps> = ({
  module,
  publication
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<AllowedToken | null>(
    null
  );
  const [loadingRedstonePrice, setLoadingRedstonePrice] = useState(false);
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

  const { actOnUnknownOpenAction, isLoading } = useActOnUnknownOpenAction({
    signlessApproved: module.signlessApproved,
    successToast: "You've sent a tip!"
  });

  const { data: allowedTokens, isLoading: loadingAllowedTokens } = useQuery({
    queryFn: () =>
      getAllTokens((tokens) =>
        setSelectedCurrency(
          tokens.find(
            (token) => token.contractAddress === DEFAULT_COLLECT_TOKEN
          ) as AllowedToken
        )
      ),
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
    try {
      setLoadingRedstonePrice(true);
      const abi = JSON.parse(metadata?.processCalldataABI);
      const currency = allowedTokens?.find(
        (token) => token.contractAddress === tip.currency
      );

      if (!currency) {
        return toast.error('Currency not supported');
      }

      const amount = tip.value[0];
      const usdPrice = await getRedstonePrice(getAssetSymbol(currency.symbol));
      const usdValue = amount / usdPrice;

      const calldata = encodeAbiParameters(abi, [
        currency.contractAddress,
        parseUnits(usdValue.toString(), currency.decimals).toString()
      ]);

      return await actOnUnknownOpenAction({
        address: module.contract.address,
        data: calldata,
        publicationId: publication.id
      });
    } finally {
      setLoadingRedstonePrice(false);
    }
  };

  return (
    <div className="space-y-3 p-5">
      <div className="flex items-center space-x-2 text-lg">
        <b>Send Tip to</b>
        <div>
          {loadingProfile ? (
            <SmallUserProfileShimmer />
          ) : profile ? (
            <SmallUserProfile profile={profile.defaultProfile as Profile} />
          ) : (
            <WalletProfile address={decoded[0]} />
          )}
        </div>
      </div>
      <div className="flex items-center space-x-3 pb-3">
        <RangeSlider
          displayValue={`$${tip.value[0]}`}
          min={1}
          onValueChange={(value) => setTip({ ...tip, value })}
          value={tip.value}
        />
        <div className="w-2/6">
          <Select
            defaultValue={DEFAULT_COLLECT_TOKEN}
            onChange={(e) => {
              setTip({ ...tip, currency: e.target.value });
              setSelectedCurrency(
                allowedTokens?.find(
                  (token) => token.contractAddress === e.target.value
                ) as AllowedToken
              );
            }}
            options={allowedTokens?.map((token) => ({
              label: token.symbol,
              value: token.contractAddress
            }))}
          />
        </div>
      </div>
      {selectedCurrency ? (
        <TipAction
          act={act}
          className="mt-5 w-full justify-center"
          icon={<CurrencyDollarIcon className="size-4" />}
          isLoading={isLoading || loadingRedstonePrice}
          module={module}
          moduleAmount={{
            asset: {
              contract: {
                address: selectedCurrency.contractAddress,
                chainId: CHAIN.id
              },
              decimals: selectedCurrency.decimals,
              name: selectedCurrency.name,
              symbol: selectedCurrency.symbol
            },
            value: tip.value[0].toString()
          }}
          title="Send Tip"
        />
      ) : null}
    </div>
  );
};

export default TipOpenActionModule;
