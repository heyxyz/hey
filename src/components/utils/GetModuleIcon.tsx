import {
  BanknotesIcon,
  ClockIcon,
  DocumentPlusIcon,
  PlusCircleIcon,
  ReceiptRefundIcon,
  ShareIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import React, { FC } from 'react';

interface Props {
  module: string;
  size: number;
}

const GetModuleIcon: FC<Props> = ({ module, size }) => {
  switch (module) {
    case 'FeeCollectModule':
      return <BanknotesIcon className={`h-${size}`} />;
    case 'LimitedFeeCollectModule':
      return (
        <div className="flex gap-1 items-center">
          <StopIcon className={`h-${size}`} />
          <BanknotesIcon className={`h-${size}`} />
        </div>
      );
    case 'LimitedTimedFeeCollectModule':
      return (
        <div className="flex gap-1 items-center">
          <StopIcon className={`h-${size}`} />
          <ClockIcon className={`h-${size}`} />
          <BanknotesIcon className={`h-${size}`} />
        </div>
      );
    case 'TimedFeeCollectModule':
      return (
        <div className="flex gap-1 items-center">
          <ClockIcon className={`h-${size}`} />
          <BanknotesIcon className={`h-${size}`} />
        </div>
      );
    case 'RevertCollectModule':
      return <ReceiptRefundIcon className={`h-${size}`} />;
    case 'FreeCollectModule':
      return <DocumentPlusIcon className={`h-${size}`} />;
    case 'FeeFollowModule':
      return (
        <div className="flex gap-1 items-center">
          <BanknotesIcon className={`h-${size}`} />
          <PlusCircleIcon className={`h-${size}`} />
        </div>
      );
    case 'FollowerOnlyReferenceModule':
      return (
        <div className="flex gap-1 items-center">
          <PlusCircleIcon className={`h-${size}`} />
          <ShareIcon className={`h-${size}`} />
        </div>
      );
    default:
      return <BanknotesIcon className={`h-${size}`} />;
  }
};

export default GetModuleIcon;
