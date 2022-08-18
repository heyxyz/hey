import { gql, useQuery } from '@apollo/client';
import { GridItemSix, GridLayout } from '@components/GridLayout';
import Collectors from '@components/Shared/Collectors';
import Markup from '@components/Shared/Markup';
import ReferralAlert from '@components/Shared/ReferralAlert';
import CrowdfundShimmer from '@components/Shared/Shimmer/CrowdfundShimmer';
import { Card } from '@components/UI/Card';
import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import { LensterPublication } from '@generated/lenstertypes';
import { CashIcon, CurrencyDollarIcon, UsersIcon } from '@heroicons/react/outline';
import getTokenImage from '@lib/getTokenImage';
import imagekitURL from '@lib/imagekitURL';
import { Mixpanel } from '@lib/mixpanel';
import clsx from 'clsx';
import React, { FC, MouseEvent, ReactNode, useEffect, useState } from 'react';
import { STATIC_ASSETS } from 'src/constants';
import { useAppPersistStore } from 'src/store/app';
import { CROWDFUND } from 'src/tracking';

import { COLLECT_QUERY } from '../Actions/Collect/CollectModule';
import Fund from './Fund';

export const PUBLICATION_REVENUE_QUERY = gql`
  query PublicationRevenue($request: PublicationRevenueQueryRequest!) {
    publicationRevenue(request: $request) {
      revenue {
        total {
          value
        }
      }
    }
  }
`;

interface BadgeProps {
  title: ReactNode;
  value: ReactNode;
}

const Badge: FC<BadgeProps> = ({ title, value }) => (
  <div className="flex bg-gray-200 rounded-full border border-gray-300 dark:bg-gray-800 dark:border-gray-700 text-[12px] w-fit">
    <div className="px-3 bg-gray-300 rounded-full dark:bg-gray-700 py-[0.3px]">{title}</div>
    <div className="pr-3 pl-2 font-bold py-[0.3px]">{value}</div>
  </div>
);

interface Props {
  fund: LensterPublication;
}

const Crowdfund: FC<Props> = ({ fund }) => {
  const isConnected = useAppPersistStore((state) => state.isConnected);
  const [showFundersModal, setShowFundersModal] = useState(false);
  const [revenue, setRevenue] = useState(0);
  const { data, loading } = useQuery(COLLECT_QUERY, {
    variables: { request: { publicationId: fund?.id } }
  });

  const collectModule: any = data?.publication?.collectModule;

  const { data: revenueData, loading: revenueLoading } = useQuery(PUBLICATION_REVENUE_QUERY, {
    variables: {
      request: {
        publicationId: fund?.__typename === 'Mirror' ? fund?.mirrorOf?.id : fund?.id
      }
    }
  });

  useEffect(() => {
    setRevenue(parseFloat(revenueData?.publicationRevenue?.earnings?.value ?? 0));
  }, [revenueData]);

  const goalAmount = fund?.metadata?.attributes[1]?.value;
  const percentageReached = revenue ? (revenue / parseInt(goalAmount as string)) * 100 : 0;
  const cover = fund?.metadata?.cover?.original?.url;

  if (loading) {
    return <CrowdfundShimmer />;
  }

  return (
    <Card forceRounded onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}>
      <div
        className="h-40 rounded-t-xl border-b sm:h-52 dark:border-b-gray-700/80"
        style={{
          backgroundImage: `url(${
            cover ? imagekitURL(cover, 'attachment') : `${STATIC_ASSETS}/patterns/2.svg`
          })`,
          backgroundColor: '#8b5cf6',
          backgroundSize: cover ? 'cover' : '30%',
          backgroundPosition: 'center center',
          backgroundRepeat: cover ? 'no-repeat' : 'repeat'
        }}
      />
      <div className="p-5">
        <div className="block justify-between items-center sm:flex">
          <div className="mr-0 space-y-1 sm:mr-16">
            <div className="text-xl font-bold">{fund?.metadata?.name}</div>
            <div className="text-sm leading-7 whitespace-pre-wrap break-words">
              <Markup>{fund?.metadata?.description?.replace(/\n\s*\n/g, '\n\n').trim()}</Markup>
            </div>
            <div className="block sm:flex items-center !my-3 space-y-2 sm:space-y-0 sm:space-x-3">
              {fund?.stats?.totalAmountOfCollects > 0 && (
                <>
                  <button
                    type="button"
                    className="text-sm"
                    onClick={() => {
                      setShowFundersModal(!showFundersModal);
                      Mixpanel.track(CROWDFUND.OPEN_FUNDERS);
                    }}
                  >
                    <Badge
                      title={
                        <div className="flex items-center space-x-1">
                          <UsersIcon className="w-3 h-3" />
                          <div>Collects</div>
                        </div>
                      }
                      value={fund?.stats?.totalAmountOfCollects}
                    />
                  </button>
                  <Modal
                    title="Funders"
                    icon={<CashIcon className="w-5 h-5 text-brand" />}
                    show={showFundersModal}
                    onClose={() => setShowFundersModal(false)}
                  >
                    <Collectors pubId={fund?.id} />
                  </Modal>
                </>
              )}
              <Badge
                title={
                  <div className="flex items-center space-x-1">
                    <CurrencyDollarIcon className="w-3 h-3" />
                    <div>Price</div>
                  </div>
                }
                value={`${collectModule?.amount?.value} ${collectModule?.amount?.asset?.symbol}`}
              />
            </div>
            <ReferralAlert mirror={fund} referralFee={collectModule?.referralFee} />
          </div>
          {isConnected && (
            <div className="pt-3 sm:pt-0">
              <Fund fund={fund} collectModule={collectModule} revenue={revenue} setRevenue={setRevenue} />
            </div>
          )}
        </div>
        {revenueLoading ? (
          <div className="w-full h-[13px] !mt-5 rounded-full shimmer" />
        ) : (
          goalAmount && (
            <Tooltip
              placement="top"
              content={
                percentageReached >= 100 ? 'Goal reached 🎉' : `${percentageReached.toFixed(0)}% Goal reached`
              }
            >
              <div className="mt-5 w-full bg-gray-200 rounded-full dark:bg-gray-700 h-[13px]">
                <div
                  className={clsx(
                    { 'bg-green-500': percentageReached >= 100 },
                    'h-[13px] rounded-full bg-brand-500'
                  )}
                  style={{
                    width: `${
                      percentageReached >= 100 ? 100 : percentageReached <= 2 ? 2 : percentageReached
                    }%`
                  }}
                />
              </div>
            </Tooltip>
          )
        )}
        <GridLayout className="!p-0 mt-5">
          <GridItemSix className="!mb-4 space-y-1 sm:mb-0">
            <div className="text-sm font-bold text-gray-500">Funds Raised</div>
            {revenueLoading ? (
              <div className="w-16 h-5 !mt-2 rounded-md shimmer" />
            ) : (
              <span className="flex items-center space-x-1.5">
                <Tooltip content={collectModule?.amount?.asset?.symbol}>
                  <img
                    className="w-7 h-7"
                    height={28}
                    width={28}
                    src={getTokenImage(collectModule?.amount?.asset?.symbol)}
                    alt={collectModule?.amount?.asset?.symbol}
                  />
                </Tooltip>
                <span className="space-x-1">
                  <span className="text-2xl font-bold">{revenue}</span>
                  <span className="text-xs">{collectModule?.amount?.asset?.symbol}</span>
                </span>
              </span>
            )}
          </GridItemSix>
          {goalAmount && (
            <GridItemSix className="space-y-1">
              <div className="text-sm font-bold text-gray-500">Funds Goal</div>
              <span className="flex items-center space-x-1.5">
                <Tooltip content={collectModule?.amount?.asset?.symbol}>
                  <img
                    className="w-7 h-7"
                    height={28}
                    width={28}
                    src={getTokenImage(collectModule?.amount?.asset?.symbol)}
                    alt={collectModule?.amount?.asset?.symbol}
                  />
                </Tooltip>
                <span className="space-x-1">
                  <span className="text-2xl font-bold">{goalAmount}</span>
                  <span className="text-xs">{collectModule?.amount?.asset?.symbol}</span>
                </span>
              </span>
            </GridItemSix>
          )}
        </GridLayout>
      </div>
    </Card>
  );
};

export default Crowdfund;
