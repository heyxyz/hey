import {
  CashIcon,
  ClockIcon,
  DocumentAddIcon,
  PlusCircleIcon,
  ReceiptRefundIcon,
  ShareIcon,
  StopIcon
} from '@heroicons/react/outline'
import React, { FC } from 'react'

interface Props {
  module: string
  size: number
}

const GetModuleIcon: FC<Props> = ({ module, size }) => {
  const stringifiedSize = size.toString()

  switch (module) {
    case 'FeeCollectModule':
      return <CashIcon className={`h-${stringifiedSize}`} />
    case 'LimitedFeeCollectModule':
      return (
        <div className="flex gap-1 items-center">
          <StopIcon className={`h-${stringifiedSize}`} />
          <CashIcon className={`h-${stringifiedSize}`} />
        </div>
      )
    case 'LimitedTimedFeeCollectModule':
      return (
        <div className="flex gap-1 items-center">
          <StopIcon className={`h-${stringifiedSize}`} />
          <ClockIcon className={`h-${stringifiedSize}`} />
          <CashIcon className={`h-${stringifiedSize}`} />
        </div>
      )
    case 'TimedFeeCollectModule':
      return (
        <div className="flex gap-1 items-center">
          <ClockIcon className={`h-${stringifiedSize}`} />
          <CashIcon className={`h-${stringifiedSize}`} />
        </div>
      )
    case 'RevertCollectModule':
      return <ReceiptRefundIcon className={`h-${stringifiedSize}`} />
    case 'RevertCollectModule':
      return <DocumentAddIcon className={`h-${stringifiedSize}`} />
    case 'FeeFollowModule':
      return (
        <div className="flex gap-1 items-center">
          <CashIcon className={`h-${stringifiedSize}`} />
          <PlusCircleIcon className={`h-${stringifiedSize}`} />
        </div>
      )
    case 'FollowerOnlyReferenceModule':
      return (
        <div className="flex gap-1 items-center">
          <PlusCircleIcon className={`h-${stringifiedSize}`} />
          <ShareIcon className={`h-${stringifiedSize}`} />
        </div>
      )
    default:
      return <CashIcon className={`h-${stringifiedSize}`} />
  }
}

export default GetModuleIcon
