'use client';
import {
  CashIcon,
  ClockIcon,
  DocumentAddIcon,
  ReceiptRefundIcon,
  ShareIcon,
  StarIcon,
  UsersIcon
} from '@heroicons/react/outline';
import { CollectModules, FollowModules, ReferenceModules } from 'lens';
import type { FC } from 'react';

interface GetModuleIconProps {
  module: string;
  size: number;
}

const GetModuleIcon: FC<GetModuleIconProps> = ({ module, size }) => {
  switch (module) {
    case CollectModules.FeeCollectModule:
      return <CashIcon className={`h-${size}`} />;
    case CollectModules.LimitedFeeCollectModule:
      return <StarIcon className={`h-${size}`} />;
    case CollectModules.LimitedTimedFeeCollectModule:
      return (
        <div className="flex items-center gap-1">
          <StarIcon className={`h-${size}`} />
          <ClockIcon className={`h-${size}`} />
        </div>
      );
    case CollectModules.TimedFeeCollectModule:
      return <ClockIcon className={`h-${size}`} />;
    case CollectModules.RevertCollectModule:
      return <ReceiptRefundIcon className={`h-${size}`} />;
    case CollectModules.FreeCollectModule:
      return <DocumentAddIcon className={`h-${size}`} />;
    case CollectModules.MultirecipientFeeCollectModule:
      return <UsersIcon className={`h-${size}`} />;
    case FollowModules.FeeFollowModule:
      return <CashIcon className={`h-${size}`} />;
    case ReferenceModules.FollowerOnlyReferenceModule:
      return <ShareIcon className={`h-${size}`} />;
    default:
      return <CashIcon className={`h-${size}`} />;
  }
};

export default GetModuleIcon;
