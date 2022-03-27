import 'linkify-plugin-mention'

import { gql, useQuery } from '@apollo/client'
import { GridItemSix, GridLayout } from '@components/GridLayout'
import Collectors from '@components/Shared/Collectors'
import { Card, CardBody } from '@components/UI/Card'
import { Modal } from '@components/UI/Modal'
import { Tooltip } from '@components/UI/Tooltip'
import { LensterCollectModule, LensterPost } from '@generated/lenstertypes'
import { CashIcon, UsersIcon } from '@heroicons/react/outline'
import { getTokenImage } from '@lib/getTokenImage'
import { linkifyOptions } from '@lib/linkifyOptions'
import clsx from 'clsx'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Linkify from 'linkify-react'
import React, { useState } from 'react'
import { STATIC_ASSETS } from 'src/constants'

import Fund from './Fund'

dayjs.extend(relativeTime)

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

const Crowdfund: React.FC<Props> = ({ fund }) => {
  // @ts-ignore
  const collectModule: LensterCollectModule = fund?.collectModule
  const [showFundersModal, setShowFundersModal] = useState<boolean>(false)
  const { data, loading } = useQuery(CROWDFUND_REVENUE_QUERY, {
    variables: { request: { publicationId: fund.pubId } },
    skip: !fund.pubId
  })

  const revenue = data?.publicationRevenue?.earnings
  const percentageReached = revenue
    ? (revenue?.value /
        parseInt(fund?.metadata?.attributes[1]?.value as string)) *
      100
    : 0
  const cover = fund?.metadata?.cover?.original?.url

  return (
    <Card>
      <div
        className="h-40 rounded-t-xl border-b sm:h-52"
        style={{
          backgroundImage: `url(${
            cover ? cover : `${STATIC_ASSETS}/patterns/2.svg`
          })`,
          backgroundColor: '#8b5cf6',
          backgroundSize: cover ? 'cover' : '30%',
          backgroundPosition: 'center center',
          backgroundRepeat: cover ? 'no-repeat' : 'repeat'
        }}
      />
      <CardBody className="linkify">
        <Linkify tagName="div" options={linkifyOptions}>
          <div>
            <div className="block justify-between items-center sm:flex">
              <div className="mr-0 space-y-1 sm:mr-16">
                <div className="text-xl font-bold">{fund?.metadata?.name}</div>
                <div>{fund?.metadata?.description}</div>
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
                      title={
                        <div className="flex items-center space-x-2">
                          <CashIcon className="w-5 h-5 text-brand-500" />
                          <div>Funders</div>
                        </div>
                      }
                      size="md"
                      show={showFundersModal}
                      onClose={() => setShowFundersModal(!showFundersModal)}
                    >
                      <Collectors pubId={fund.pubId} />
                    </Modal>
                  </>
                )}
              </div>
              <Fund fund={fund} />
            </div>
            {loading ? (
              <div className="w-full h-[13px] !mt-5 rounded-full shimmer" />
            ) : (
              <Tooltip
                content={
                  percentageReached >= 100
                    ? 'Goal reached 🎉'
                    : `${percentageReached}% Goal reached`
                }
              >
                <div className="mt-5 w-full bg-gray-200 rounded-full dark:bg-gray-700 h-[13px]">
                  <div
                    className={clsx(
                      { 'bg-green-500': percentageReached >= 100 },
                      'h-[13px] rounded-full bg-brand-500'
                    )}
                    style={{ width: `${percentageReached}%` }}
                  />
                </div>
              </Tooltip>
            )}
            <GridLayout className="!p-0 mt-5">
              <GridItemSix className="!mb-4 space-y-1 sm:mb-0">
                <div className="text-sm font-bold text-gray-500">
                  Funds Raised
                </div>
                {loading ? (
                  <div className="w-16 h-5 !mt-2 rounded-md shimmer" />
                ) : (
                  <span className="flex items-center space-x-1.5">
                    <Tooltip content={collectModule?.amount?.asset?.symbol}>
                      <img
                        className="w-7 h-7"
                        src={getTokenImage(collectModule.amount.asset.symbol)}
                        alt={collectModule?.amount?.asset?.symbol}
                      />
                    </Tooltip>
                    <span className="space-x-1">
                      <span className="text-2xl font-bold">
                        {revenue ? revenue?.value : 0}
                      </span>
                      <span className="text-xs">
                        {collectModule?.amount?.asset?.symbol}
                      </span>
                    </span>
                  </span>
                )}
              </GridItemSix>
              <GridItemSix className="space-y-1">
                <div className="text-sm font-bold text-gray-500">
                  Funds Goal
                </div>
                <span className="flex items-center space-x-1.5">
                  <Tooltip content={collectModule?.amount?.asset?.symbol}>
                    <img
                      className="w-7 h-7"
                      src={getTokenImage(collectModule?.amount?.asset?.symbol)}
                      alt={collectModule?.amount?.asset?.symbol}
                    />
                  </Tooltip>
                  <span className="space-x-1">
                    <span className="text-2xl font-bold">
                      {fund?.metadata?.attributes[1]?.value}
                    </span>
                    <span className="text-xs">
                      {collectModule?.amount?.asset?.symbol}
                    </span>
                  </span>
                </span>
              </GridItemSix>
            </GridLayout>
          </div>
        </Linkify>
      </CardBody>
    </Card>
  )
}

export default Crowdfund
