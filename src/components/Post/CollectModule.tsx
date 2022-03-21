import { Card, CardBody } from '@components/UI/Card'
import { Tooltip } from '@components/UI/Tooltip'
import { LensterCollectModule, LensterPost } from '@generated/lenstertypes'
import { CollectModule } from '@generated/types'
import { CollectionIcon } from '@heroicons/react/outline'
import { formatUsername } from '@lib/formatUsername'
import { getModule } from '@lib/getModule'
import { getTokenImage } from '@lib/getTokenImage'
import clsx from 'clsx'
import React from 'react'

interface Props {
  post: LensterPost
}

const CollectModule: React.FC<Props> = ({ post }) => {
  // @ts-ignore
  const collectModule: LensterCollectModule = post?.collectModule
  const percentageCollected =
    (post?.stats?.totalAmountOfCollects /
      parseInt(collectModule?.collectLimit)) *
    100

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <CollectionIcon className="w-4 h-4 text-yellow-500" />
        <div>Collect Module</div>
      </div>
      <Card>
        {collectModule.type === 'LimitedFeeCollectModule' ||
          (collectModule.type === 'LimitedTimedFeeCollectModule' && (
            <div className="w-full bg-gray-200 rounded-t-xl h-2.5 dark:bg-gray-700">
              <div
                className={clsx(
                  { 'rounded-tr-xl': percentageCollected === 100 },
                  'bg-brand-500 h-2.5 rounded-tl-xl'
                )}
                style={{ width: `${percentageCollected}%` }}
              />
            </div>
          ))}
        <CardBody className="space-y-1">
          <div className="space-x-1.5">
            <span>Module:</span>
            <span className="font-bold text-gray-600">
              {getModule(collectModule.type).name}
            </span>
          </div>
          <div className="space-x-1.5">
            <span>Recipient:</span>
            <a
              href={`https://mumbai.polygonscan.com/address/${collectModule.recipient}`}
              target="_blank"
              className="font-bold text-gray-600"
              rel="noreferrer"
            >
              {formatUsername(collectModule.recipient)}
            </a>
          </div>
          <div className="space-x-1.5">
            <span>Referral Fee:</span>
            <span className="font-bold text-gray-600">
              {collectModule.referralFee}%
            </span>
          </div>
          {collectModule.collectLimit && (
            <div className="space-x-1.5">
              <span>Collect limit:</span>
              <span className="font-bold text-gray-600">
                {collectModule.collectLimit}
              </span>
            </div>
          )}
          <div className="space-x-1.5 flex items-center">
            <span>Fee:</span>
            <span className="flex items-center space-x-1.5 font-bold text-gray-600">
              <span>{collectModule.amount.value}</span>
              <span>{collectModule.amount.asset.symbol}</span>
              <Tooltip content={collectModule.amount.asset.symbol}>
                <img
                  className="w-5 h-5"
                  src={getTokenImage(collectModule.amount.asset.symbol)}
                  alt={collectModule.amount.asset.symbol}
                />
              </Tooltip>
            </span>
          </div>
          {collectModule.endTimestamp && (
            <div className="space-x-1.5">
              <span>Ends in:</span>
              <span className="font-bold text-gray-600">
                {(
                  Math.abs(
                    new Date().getTime() -
                      new Date(collectModule.endTimestamp).getTime()
                  ) / 36e5
                ).toFixed(1)}
              </span>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default CollectModule
