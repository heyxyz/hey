import Slug from '@components/Shared/Slug';
import { Mirror } from '@generated/types';
import { HeartIcon } from '@heroicons/react/solid';
import React, { FC } from 'react';

interface Props {
  mirror: Mirror;
  referralFee?: number;
}

const ReferralAlert: FC<Props> = ({ mirror, referralFee = 0 }) => {
  if (mirror?.__typename !== 'Mirror' || referralFee === 0) return null;

  return (
    <div className="flex items-center pt-1 space-x-1.5 text-sm text-gray-500">
      <HeartIcon className="w-4 h-4 text-pink-500" />
      <Slug slug={mirror?.profile?.handle} prefix="@" />
      <span>
        {' '}
        will get <b>{referralFee}%</b> referral fee
      </span>
    </div>
  );
};

export default ReferralAlert;
