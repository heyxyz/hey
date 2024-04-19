import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import { DEFAULT_COLLECT_TOKEN, STATIC_IMAGES_URL } from '@hey/data/constants';
import {
  FollowModuleType,
  useApprovedModuleAllowanceAmountQuery
} from '@hey/lens';
import allowedOpenActionModules from '@hey/lib/allowedOpenActionModules';
import { CardHeader, ErrorMessage, Select } from '@hey/ui';
import { useState } from 'react';
import { useAllowedTokensStore } from 'src/store/persisted/useAllowedTokens';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import Allowance from './Allowance';

const getAllowancePayload = (currency: string) => {
  return {
    currencies: [currency],
    followModules: [FollowModuleType.FeeFollowModule],
    openActionModules: allowedOpenActionModules
  };
};

const CollectModules: FC = () => {
  const { currentProfile } = useProfileStore();
  const { allowedTokens } = useAllowedTokensStore();
  const [selectedCurrency, setSelectedCurrency] = useState(
    DEFAULT_COLLECT_TOKEN
  );
  const [currencyLoading, setCurrencyLoading] = useState(false);

  const { data, error, loading, refetch } =
    useApprovedModuleAllowanceAmountQuery({
      fetchPolicy: 'no-cache',
      skip: !currentProfile?.id,
      variables: { request: getAllowancePayload(DEFAULT_COLLECT_TOKEN) }
    });

  if (error) {
    return (
      <ErrorMessage
        className="mt-5"
        error={error}
        title="Failed to load data"
      />
    );
  }

  return (
    <div>
      <CardHeader
        body="In order to use collect feature you need to allow the module you
            use, you can allow and revoke the module anytime."
        title="Allow / revoke follow or collect modules"
      />
      <div className="m-5">
        <div className="label">Select currency</div>
        <Select
          iconClassName="size-4"
          onChange={(value) => {
            setCurrencyLoading(true);
            setSelectedCurrency(value);
            refetch({
              request: getAllowancePayload(value)
            }).finally(() => setCurrencyLoading(false));
          }}
          options={
            allowedTokens?.map((token) => ({
              icon: `${STATIC_IMAGES_URL}/tokens/${token.symbol}.svg`,
              label: token.name,
              selected: token.contractAddress === selectedCurrency,
              value: token.contractAddress
            })) || [{ label: 'Loading...', value: 'Loading...' }]
          }
        />
        {loading || currencyLoading ? (
          <Loader className="py-10" />
        ) : (
          <Allowance allowance={data} />
        )}
      </div>
    </div>
  );
};

export default CollectModules;
