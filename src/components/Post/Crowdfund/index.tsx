import 'linkify-plugin-mention'

import { gql, useQuery } from '@apollo/client'
import { GridItemSix, GridLayout } from '@components/GridLayout'
import Collectors from '@components/Shared/Collectors'
import CrowdfundShimmer from '@components/Shared/Shimmer/CrowdfundShimmer'
import { Card } from '@components/UI/Card'
import { Modal } from '@components/UI/Modal'
import { Tooltip } from '@components/UI/Tooltip'
import { LensterCollectModule, LensterPost } from '@generated/lenstertypes'
import { CashIcon, UsersIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import getTokenImage from '@lib/getTokenImage'
import imagekitURL from '@lib/imagekitURL'
import linkifyOptions from '@lib/linkifyOptions'
import clsx from 'clsx'
import Linkify from 'linkify-react'
import React, { FC, useEffect, useState } from 'react'
import { STATIC_ASSETS } from 'src/constants'

import { COLLECT_QUERY } from '../Actions/Collect/CollectModule'
import Fund from './Fund'

export const CROWDFUND_REVENUE_QUERY = gql`
  query CrowdfundRevenue($request: PublicationRevenueQueryRequest!) {
    publicationRevenue(request: $request) {
      earnings {
        value
      }
    }
  }
`

interface Props {
  fund: LensterPost
}

const Crowdfund: FC<Props> = ({ fund }) => {
  const [showFundersModal, setShowFundersModal] = useState<boolean>(false)
  const [revenue, setRevenue] = useState<number>(0)
  const { data, loading } = useQuery(COLLECT_QUERY, {
    variables: { request: { publicationId: fund?.id } },
    skip: !fund?.id,
    onCompleted() {
      consoleLog(
        'Fetch',
        '#8b5cf6',
        `Fetched collect module details Crowdfund:${fund?.id}`
      )
    }
  })

  // @ts-ignore
  const collectModule: LensterCollectModule = data?.publication?.collectModule

  const { data: revenueData, loading: revenueLoading } = useQuery(
    CROWDFUND_REVENUE_QUERY,
    {
      variables: { request: { publicationId: fund?.id } },
      skip: !fund?.id,
      onCompleted() {
        consoleLog(
          'Fetch',
          '#8b5cf6',
          `Fetched crowdfund revenue details Crowdfund:${fund?.id}`
        )
      }
    }
  )

  useEffect(() => {
    setRevenue(
      parseFloat(revenueData?.publicationRevenue?.earnings?.value ?? 0)
    )
  }, [revenueData])

  const goalAmount = fund?.metadata?.attributes[1]?.value
  const percentageReached = revenue
    ? (revenue / parseInt(goalAmount as string)) * 100
    : 0
  const cover = fund?.metadata?.cover?.original?.url

  if (loading) return <CrowdfundShimmer />

  return (
    <Card>
      <div
        className="h-40 border-b rounded-t-xl sm:h-52"
        style={{
          backgroundImage: `url(${
            cover ? imagekitURL(cover) : `${STATIC_ASSETS}/patterns/2.svg`
          })`,
          backgroundColor: '#8b5cf6',
          backgroundSize: cover ? 'cover' : '30%',
          backgroundPosition: 'center center',
          backgroundRepeat: cover ? 'no-repeat' : 'repeat'
        }}
      />
      <div className="p-5">
        <div className="items-center justify-between block sm:flex">
          <div className="mr-0 space-y-1 sm:mr-16">
            <div className="text-xl font-bold">{fund?.metadata?.name}</div>
            <Linkify tagName="div" options={linkifyOptions}>
              <div className="break-words whitespace-pre-wrap">
                {fund?.metadata?.description
                  ?.replace(/\n\s*\n/g, '\n\n')
                  .trim()}
              </div>
            </Linkify>
            {fund?.stats?.totalAmountOfCollects > 0 && (
              <>
                <div className="flex items-center space-x-1.5 !mt-2 text-gray-500">
                  <UsersIcon className="w-4 h-4" />
                  <button
                    className="text-sm"
                    onClick={() => setShowFundersModal(!showFundersModal)}
                  >
                    {fund?.stats?.totalAmountOfCollects} funds received
                  </button>
                </div>
                <Modal
                  title="Funders"
                  icon={<CashIcon className="w-5 h-5 text-brand-500" />}
                  show={showFundersModal}
                  onClose={() => setShowFundersModal(!showFundersModal)}
                >
                  <Collectors pubId={fund?.id} />
                </Modal>
              </>
            )}
          </div>
          <Fund fund={fund} revenue={revenue} setRevenue={setRevenue} />
        </div>
        {revenueLoading ? (
          <div className="w-full h-[13px] !mt-5 rounded-full shimmer" />
        ) : (
          goalAmount && (
            <Tooltip
              content={
                percentageReached >= 100
                  ? 'Goal reached 🎉'
                  : `${percentageReached.toFixed(0)}% Goal reached`
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
                      percentageReached >= 100 ? 100 : percentageReached
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
                    src={getTokenImage(collectModule?.amount?.asset?.symbol)}
                    alt={collectModule?.amount?.asset?.symbol}
                  />
                </Tooltip>
                <span className="space-x-1">
                  <span className="text-2xl font-bold">{revenue}</span>
                  <span className="text-xs">
                    {collectModule?.amount?.asset?.symbol}
                  </span>
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
                    src={getTokenImage(collectModule?.amount?.asset?.symbol)}
                    alt={collectModule?.amount?.asset?.symbol}
                  />
                </Tooltip>
                <span className="space-x-1">
                  <span className="text-2xl font-bold">{goalAmount}</span>
                  <span className="text-xs">
                    {collectModule?.amount?.asset?.symbol}
                  </span>
                </span>
              </span>
            </GridItemSix>
          )}
        </GridLayout>
      </div>
    </Card>
  )
}

export default Crowdfund
