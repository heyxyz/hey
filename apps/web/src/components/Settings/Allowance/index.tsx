import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import Loader from '@components/Shared/Loader';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME, DEFAULT_COLLECT_TOKEN } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import {
  FollowModuleType,
  useApprovedModuleAllowanceAmountQuery
} from '@hey/lens';
import allowedOpenActionModules from '@hey/lib/allowedOpenActionModules';
import getAllTokens from '@hey/lib/api/getAllTokens';
import { Card, GridItemEight, GridItemFour, GridLayout, Select } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Custom500 from 'src/pages/500';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import Allowance from './Allowance';

const getAllowancePayload = (currency: string) => {
  return {
    currencies: [currency],
    followModules: [FollowModuleType.FeeFollowModule],
    openActionModules: allowedOpenActionModules
  };
};

const AllowanceSettings: NextPage = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const [currencyLoading, setCurrencyLoading] = useState(false);

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'allowance' });
  });

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
      skip: !currentProfile?.id || allowedTokensLoading,
      variables: { request: getAllowancePayload(DEFAULT_COLLECT_TOKEN) }
    });

  if (error || allowedTokensError) {
    return <Custom500 />;
  }

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Allowance settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <div className="mx-5 mt-5">
            <div className="space-y-3">
              <div className="text-lg font-bold">Allow / revoke modules</div>
              <p>
                In order to use collect feature you need to allow the module you
                use, you can allow and revoke the module anytime.
              </p>
            </div>
            <div className="divider my-5" />
            <div className="label mt-6">Select currency</div>
            <Select
              onChange={(e) => {
                setCurrencyLoading(true);
                refetch({
                  request: getAllowancePayload(e.target.value)
                }).finally(() => setCurrencyLoading(false));
              }}
              options={
                allowedTokens?.map((token) => ({
                  label: token.name,
                  value: token.contractAddress
                })) || [
                  {
                    label: 'Loading...',
                    value: 'Loading...'
                  }
                ]
              }
            />
          </div>
          {loading || allowedTokensLoading || currencyLoading ? (
            <div className="py-5">
              <Loader />
            </div>
          ) : (
            <Allowance allowance={data} />
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default AllowanceSettings;
