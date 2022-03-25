import 'linkify-plugin-mention'

import { GridItemSix, GridLayout } from '@components/GridLayout'
import { Tooltip } from '@components/UI/Tooltip'
import { LensterCollectModule, LensterPost } from '@generated/lenstertypes'
import { getTokenImage } from '@lib/getTokenImage'
import { linkifyOptions } from '@lib/linkifyOptions'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Linkify from 'linkify-react'
import React from 'react'

dayjs.extend(relativeTime)

interface Props {
  fund: LensterPost
}

const Crowdfund: React.FC<Props> = ({ fund }) => {
  // @ts-ignore
  const collectModule: LensterCollectModule = fund?.collectModule

  return (
    <div className="linkify">
      <Linkify tagName="div" options={linkifyOptions}>
        <div>
          <div className="space-y-1">
            <div className="text-xl font-bold">{fund?.metadata?.name}</div>
            <div>{fund?.metadata?.description}</div>
          </div>
          <div className="w-full h-3 mt-5 bg-gray-200 rounded-full dark:bg-gray-700">
            <div
              className="h-3 rounded-full bg-brand-500"
              style={{ width: `50%` }}
            />
          </div>
          <GridLayout className="!p-0 mt-5">
            <GridItemSix className="space-y-1">
              <div className="text-sm font-bold text-gray-500">
                Funds Raised
              </div>
              <div className="flex items-center space-x-2 text-xl font-bold">
                <div>{fund?.metadata?.attributes[1]?.value}</div>
                <Tooltip content={collectModule?.amount?.asset?.symbol}>
                  <img
                    className="w-6 h-6"
                    src={getTokenImage(collectModule?.amount?.asset?.symbol)}
                    alt={collectModule?.amount?.asset?.symbol}
                  />
                </Tooltip>
              </div>
            </GridItemSix>
            <GridItemSix className="space-y-1">
              <div className="text-sm font-bold text-gray-500">Funds Goal</div>
              <div className="flex items-center space-x-2 text-xl font-bold">
                <div>{fund?.metadata?.attributes[1]?.value}</div>
                <Tooltip content={collectModule?.amount?.asset?.symbol}>
                  <img
                    className="w-6 h-6"
                    src={getTokenImage(collectModule?.amount?.asset?.symbol)}
                    alt={collectModule?.amount?.asset?.symbol}
                  />
                </Tooltip>
              </div>
            </GridItemSix>
          </GridLayout>
        </div>
      </Linkify>
    </div>
  )
}

export default Crowdfund
