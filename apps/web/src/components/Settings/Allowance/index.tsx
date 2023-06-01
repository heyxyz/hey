import MetaTags from '@components/Common/MetaTags';
import Loader from '@components/Shared/Loader';
import { APP_NAME, DEFAULT_COLLECT_TOKEN } from '@lenster/data/constants';
import type { Erc20 } from '@lenster/lens';
import {
  CollectModules,
  FollowModules,
  ReferenceModules,
  useApprovedModuleAllowanceAmountQuery,
  useEnabledModulesQuery
} from '@lenster/lens';
import { Card, GridItemEight, GridItemFour, GridLayout } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import type { NextPage } from 'next';
import { useState } from 'react';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';
import { useEffectOnce } from 'usehooks-ts';

import SettingsSidebar from '../Sidebar';
import Allowance from './Allowance';

const getAllowancePayload = (currency: string) => {
  return {
    currencies: [currency],
    collectModules: [
      CollectModules.SimpleCollectModule,
      CollectModules.RevertCollectModule,
      CollectModules.MultirecipientFeeCollectModule
    ],
    followModules: [FollowModules.FeeFollowModule],
    referenceModules: [ReferenceModules.FollowerOnlyReferenceModule]
  };
};

const AllowanceSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [currencyLoading, setCurrencyLoading] = useState(false);

  const {
    data: enabledModules,
    loading: enabledModulesLoading,
    error: enabledModulesError
  } = useEnabledModulesQuery();

  const { data, loading, error, refetch } =
    useApprovedModuleAllowanceAmountQuery({
      variables: { request: getAllowancePayload(DEFAULT_COLLECT_TOKEN) },
      skip: !currentProfile?.id || enabledModulesLoading
    });

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'settings', subpage: 'allowance' });
  });

  if (error || enabledModulesError) {
    return <Custom500 />;
  }

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={t`Allowance settings • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsSidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <div className="mx-5 mt-5">
            <div className="space-y-5">
              <div className="text-lg font-bold">
                <Trans>Allow / Revoke modules</Trans>
              </div>
              <p>
                <Trans>
                  In order to use collect feature you need to allow the module
                  you use, you can allow and revoke the module anytime.
                </Trans>
              </p>
            </div>
            <div className="divider my-5" />
            <div className="label mt-6">
              <Trans>Select Currency</Trans>
            </div>
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
                enabledModules?.enabledModuleCurrencies.map(
                  (currency: Erc20) => (
                    <option key={currency.address} value={currency.address}>
                      {currency.name}
                    </option>
                  )
                )
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
