import { APP_NAME, DEFAULT_COLLECT_TOKEN } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import type { Erc20 } from '@hey/lens';
import {
  FollowModuleType,
  LimitType,
  OpenActionModuleType,
  useApprovedModuleAllowanceAmountQuery,
  useEnabledCurrenciesQuery
} from '@hey/lens';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@hey/ui';
import { useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';

import MetaTags from '@/components/Common/MetaTags';
import Loader from '@/components/Shared/Loader';
import NotLoggedIn from '@/components/Shared/NotLoggedIn';
import { Leafwatch } from '@/lib/leafwatch';
import Custom500 from '@/pages/500';
import useProfileStore from '@/store/persisted/useProfileStore';

import SettingsSidebar from '../Sidebar';
import Allowance from './Allowance';

const getAllowancePayload = (currency: string) => {
  return {
    currencies: [currency],
    openActionModules: [
      OpenActionModuleType.SimpleCollectOpenActionModule,
      OpenActionModuleType.MultirecipientFeeCollectOpenActionModule,
      OpenActionModuleType.LegacySimpleCollectModule,
      OpenActionModuleType.LegacyMultirecipientFeeCollectModule
    ],
    followModules: [FollowModuleType.FeeFollowModule]
  };
};

const AllowanceSettings = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const [currencyLoading, setCurrencyLoading] = useState(false);

  const {
    data: enabledModules,
    loading: enabledModulesLoading,
    error: enabledModulesError
  } = useEnabledCurrenciesQuery({
    variables: { request: { limit: LimitType.TwentyFive } }
  });

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'allowance' });
  });

  const { data, loading, error, refetch } =
    useApprovedModuleAllowanceAmountQuery({
      variables: { request: getAllowancePayload(DEFAULT_COLLECT_TOKEN) },
      skip: !currentProfile?.id || enabledModulesLoading
    });

  if (error || enabledModulesError) {
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
            <select
              className="focus:border-brand-500 focus:ring-brand-400 w-full rounded-xl border border-gray-300 bg-white outline-none dark:border-gray-700 dark:bg-gray-800"
              onChange={(e) => {
                setCurrencyLoading(true);
                refetch({
                  request: getAllowancePayload(e.target.value)
                }).finally(() => setCurrencyLoading(false));
              }}
            >
              {enabledModulesLoading ? (
                <option>Loading...</option>
              ) : (
                enabledModules?.currencies.items.map((currency: Erc20) => (
                  <option
                    key={currency.contract.address}
                    value={currency.contract.address}
                  >
                    {currency.name}
                  </option>
                ))
              )}
            </select>
          </div>
          {loading || enabledModulesLoading || currencyLoading ? (
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
