import { useQuery } from '@apollo/client';
import { Card } from '@components/UI/Card';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import { PageLoading } from '@components/UI/PageLoading';
import { Spinner } from '@components/UI/Spinner';
import MetaTags from '@components/utils/MetaTags';
import type { Erc20 } from '@generated/types';
import {
  ApprovedModuleAllowanceAmountDocument,
  CollectModules,
  FollowModules,
  ReferenceModules
} from '@generated/types';
import { Mixpanel } from '@lib/mixpanel';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { APP_NAME, DEFAULT_COLLECT_TOKEN } from 'src/constants';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import Sidebar from '../Sidebar';
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
  useEffect(() => {
    Mixpanel.track('Pageview', { path: PAGEVIEW.SETTINGS.ALLOWANCE });
  }, []);

  const currentProfile = useAppStore((state) => state.currentProfile);
  const [currencyLoading, setCurrencyLoading] = useState(false);
  const { data, loading, error, refetch } = useQuery(ApprovedModuleAllowanceAmountDocument, {
    variables: {
      request: getAllowancePayload(DEFAULT_COLLECT_TOKEN)
    },
    skip: !currentProfile?.id
  });

  if (error) {
    return <Custom500 />;
  }

  if (loading) {
    return <PageLoading message="Loading settings" />;
  }

  if (!currentProfile) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Allowance settings • ${APP_NAME}`} />
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <div className="mx-5 mt-5">
            <div className="space-y-5">
              <div className="text-lg font-bold">Allow / Revoke modules</div>
              <p>
                In order to use collect feature you need to allow the module you use, you can allow and revoke
                the module anytime.
              </p>
            </div>
            <div className="mt-6 label">Select Currency</div>
            <select
              className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 dark:border-gray-700/80 focus:border-brand-500 focus:ring-brand-400"
              onChange={(e) => {
                setCurrencyLoading(true);
                refetch({
                  request: getAllowancePayload(e.target.value)
                }).finally(() => setCurrencyLoading(false));
              }}
            >
              {data?.enabledModuleCurrencies.map((currency: Erc20) => (
                <option key={currency.address} value={currency.address}>
                  {currency.name}
                </option>
              ))}
            </select>
          </div>
          {currencyLoading ? (
            <div className="py-10 space-y-3 text-center">
              <Spinner className="mx-auto" />
              <div>Loading allowance data!</div>
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
