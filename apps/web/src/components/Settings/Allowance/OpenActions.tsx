import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import { DEFAULT_COLLECT_TOKEN } from '@hey/data/constants';
import { useApprovedModuleAllowanceAmountQuery } from '@hey/lens';
import allowedUnknownOpenActionModules from '@hey/lib/allowedUnknownOpenActionModules';
import getAllTokens from '@hey/lib/api/getAllTokens';
import { ErrorMessage, Select } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import Allowance from './Allowance';

const getAllowancePayload = (currency: string) => {
  return {
    currencies: [currency],
    unknownOpenActionModules: allowedUnknownOpenActionModules
  };
};

const OpenActions: FC = () => {
  const { currentProfile } = useProfileStore();
  const [selectedCurrency, setSelectedCurrency] = useState(
    DEFAULT_COLLECT_TOKEN
  );
  const [currencyLoading, setCurrencyLoading] = useState(false);

  const {
    data: allowedTokens,
    error: allowedTokensError,
    isLoading: allowedTokensLoading
  } = useQuery({
    queryFn: () => getAllTokens(),
    queryKey: ['getAllTokens']
  });

  const { data, error, loading, refetch } =
    useApprovedModuleAllowanceAmountQuery({
      fetchPolicy: 'no-cache',
      skip: !currentProfile?.id || allowedTokensLoading,
      variables: { request: getAllowancePayload(DEFAULT_COLLECT_TOKEN) }
    });

  if (error || allowedTokensError) {
    return (
      <ErrorMessage
        className="mt-5"
        error={(error || allowedTokensError) as Error}
        title="Failed to load data"
      />
    );
  }

  return (
    <div className="mt-5">
      <div>
        <div className="space-y-3">
          <div className="text-lg font-bold">Allow / revoke open actions</div>
          <p>
            In order to use open actions feature you need to allow the module
            you use, you can allow and revoke the module anytime.
          </p>
        </div>
        <div className="divider my-5" />
        <div className="label mt-6">Select currency</div>
        <Select
          onChange={(value) => {
            setCurrencyLoading(true);
            setSelectedCurrency(value);
            refetch({
              request: getAllowancePayload(value)
            }).finally(() => setCurrencyLoading(false));
          }}
          options={
            allowedTokens?.map((token) => ({
              label: token.name,
              selected: token.contractAddress === selectedCurrency,
              value: token.contractAddress
            })) || [{ label: 'Loading...', value: 'Loading...' }]
          }
        />
      </div>
      {loading || allowedTokensLoading || currencyLoading ? (
        <Loader className="py-5" />
      ) : (
        <Allowance allowance={data} />
      )}
    </div>
  );
};

export default OpenActions;
