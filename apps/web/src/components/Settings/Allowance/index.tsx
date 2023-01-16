import MetaTags from '@components/Common/MetaTags';
import Loader from '@components/Shared/Loader';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import { Trans } from '@lingui/macro';
import { APP_NAME, DEFAULT_COLLECT_TOKEN } from 'data/constants';
import type { Erc20 } from 'lens';
import { CollectModules, FollowModules, ReferenceModules, useApprovedModuleAllowanceAmountQuery } from 'lens';
import type { NextPage } from 'next';
import { useState } from 'react';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';

import SettingsSidebar from '../Sidebar';
import Allowance from './Allowance';

const getAllowancePayload = (currency: string) => {
  return {
    currencies: [currency],
    collectModules: [
      CollectModules.LimitedFeeCollectModule,
      CollectModules.FeeCollectModule,
      CollectModules.LimitedTimedFeeCollectModule,
      CollectModules.TimedFeeCollectModule,
      CollectModules.FreeCollectModule,
      CollectModules.RevertCollectModule
    ],
    followModules: [FollowModules.FeeFollowModule],
    referenceModules: [ReferenceModules.FollowerOnlyReferenceModule]
  };
};

const AllowanceSettings: NextPage = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [currencyLoading, setCurrencyLoading] = useState(false);
  const { data, loading, error, refetch } = useApprovedModuleAllowanceAmountQuery({
    variables: {
      request: getAllowancePayload(DEFAULT_COLLECT_TOKEN)
    },
    skip: !currentProfile?.id
  });

  if (error) {
    return <Custom500 />;
  }

  if (!currentProfile) {
    return <Custom404 />;
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
            <div className="space-y-5">
              <div className="text-lg font-bold">
                <Trans>Allow / Revoke modules</Trans>
              </div>
              <p>
                <Trans>
                  In order to use collect feature you need to allow the module you use, you can allow and
                  revoke the module anytime.
                </Trans>
              </p>
            </div>
            <div className="divider my-5" />
            <div className="mt-6 label">
              <Trans>Select Currency</Trans>
            </div>
            <select
              className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-400"
              onChange={(e) => {
                setCurrencyLoading(true);
                refetch({
                  request: getAllowancePayload(e.target.value)
                }).finally(() => setCurrencyLoading(false));
              }}
            >
              {loading ? (
                <option>Loading...</option>
              ) : (
                data?.enabledModuleCurrencies.map((currency: Erc20) => (
                  <option key={currency.address} value={currency.address}>
                    {currency.name}
                  </option>
                ))
              )}
            </select>
          </div>
          {loading || currencyLoading ? (
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
