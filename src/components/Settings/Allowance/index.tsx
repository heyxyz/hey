import { gql, useQuery } from '@apollo/client';
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import { Card } from '@components/UI/Card';
import { PageLoading } from '@components/UI/PageLoading';
import { Spinner } from '@components/UI/Spinner';
import Seo from '@components/utils/Seo';
import { Erc20 } from '@generated/types';
import { Mixpanel } from '@lib/mixpanel';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { APP_NAME, DEFAULT_COLLECT_TOKEN } from 'src/constants';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppPersistStore } from 'src/store/app';
import { PAGEVIEW } from 'src/tracking';

import Sidebar from '../Sidebar';
import Allowance from './Allowance';

export const ALLOWANCE_SETTINGS_QUERY = gql`
  query ApprovedModuleAllowanceAmount($request: ApprovedModuleAllowanceAmountRequest!) {
    approvedModuleAllowanceAmount(request: $request) {
      currency
      module
      allowance
      contractAddress
    }
    enabledModuleCurrencies {
      name
      symbol
      decimals
      address
    }
  }
`;

const getAllowancePayload = (currency: string) => {
  return {
    currencies: [currency],
    collectModules: [
      'LimitedFeeCollectModule',
      'FeeCollectModule',
      'LimitedTimedFeeCollectModule',
      'TimedFeeCollectModule',
      'FreeCollectModule',
      'RevertCollectModule'
    ],
    followModules: ['FeeFollowModule'],
    referenceModules: ['FollowerOnlyReferenceModule']
  };
};

const AllowanceSettings: NextPage = () => {
  useEffect(() => {
    Mixpanel.track(PAGEVIEW.SETTINGS.ALLOWANCE);
  }, []);

  const currentUser = useAppPersistStore((state) => state.currentUser);
  const [currencyLoading, setCurrencyLoading] = useState<boolean>(false);
  const { data, loading, error, refetch } = useQuery(ALLOWANCE_SETTINGS_QUERY, {
    variables: {
      request: getAllowancePayload(DEFAULT_COLLECT_TOKEN)
    },
    skip: !currentUser?.id
  });

  if (error) {
    return <Custom500 />;
  }

  if (loading) {
    return <PageLoading message="Loading settings" />;
  }

  if (!currentUser) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <Seo title={`Allowance settings • ${APP_NAME}`} />
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
