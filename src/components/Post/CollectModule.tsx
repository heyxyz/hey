import { Card, CardBody } from '@components/UI/Card'
import { Tooltip } from '@components/UI/Tooltip'
import {
  CollectModule,
  LimitedTimedFeeCollectModuleSettings
} from '@generated/types'
import { CollectionIcon } from '@heroicons/react/outline'
import { formatUsername } from '@lib/formatUsername'
import { getTokenImage } from '@lib/getTokenImage'
import React from 'react'

interface Props {
  module: LimitedTimedFeeCollectModuleSettings
}

const CollectModule: React.FC<Props> = ({ module }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <CollectionIcon className="w-4 h-4 text-yellow-500" />
        <div>Collect Module</div>
      </div>
      <Card>
        <CardBody>
          <div className="space-x-1.5">
            <span>Module:</span>
            <span className="font-bold text-gray-600">{module.type}</span>
          </div>
          <div className="space-x-1.5">
            <span>Recipient:</span>
            <a
              href={`https://mumbai.polygonscan.com/address/${module.recipient}`}
              target="_blank"
              className="font-bold text-gray-600"
              rel="noreferrer"
            >
              {formatUsername(module.recipient)}
            </a>
          </div>
          <div className="space-x-1.5">
            <span>Referral Fee:</span>
            <span className="font-bold text-gray-600">
              {module.referralFee}%
            </span>
          </div>
          {module.collectLimit && (
            <div className="space-x-1.5">
              <span>Collect limit:</span>
              <span className="font-bold text-gray-600">
                {module.collectLimit}
              </span>
            </div>
          )}
          <div className="space-x-1.5 flex items-center">
            <span>Fee:</span>
            <span className="flex items-center space-x-1.5 font-bold text-gray-600">
              <span>{module.amount.value}</span>
              <Tooltip content={module.amount.asset.symbol}>
                <img
                  className="w-5 h-5"
                  src={getTokenImage(module.amount.asset.symbol)}
                  alt={module.amount.asset.symbol}
                />
              </Tooltip>
            </span>
          </div>
          {module.endTimestamp && (
            <div className="space-x-1.5">
              <span>Ends in:</span>
              <span className="font-bold text-gray-600">
                {(
                  Math.abs(
                    new Date().getTime() -
                      new Date(module.endTimestamp).getTime()
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
