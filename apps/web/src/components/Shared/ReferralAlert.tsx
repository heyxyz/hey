import Slug from '@components/Shared/Slug';
import { HeartIcon } from '@heroicons/react/solid';
import type { ElectedMirror, Mirror } from 'lens';
import type { FC } from 'react';

interface Props {
  mirror: Mirror;
  referralFee?: number;
  electedMirror?: ElectedMirror;
}

const ReferralAlert: FC<Props> = ({ mirror, electedMirror, referralFee = 0 }) => {
  if ((mirror.__typename !== 'Mirror' && !electedMirror) || referralFee === 0) {
    return null;
  }
  const publication = electedMirror ?? mirror;

  return (
    <div className="flex items-center pt-1 space-x-1.5 text-sm text-gray-500">
      <HeartIcon className="w-4 h-4 text-pink-500" />
      <Slug slug={publication?.profile?.handle} prefix="@" />
      <span>
        {' '}
        will get <b>{referralFee}%</b> referral fee
      </span>
    </div>
  );
};

export default ReferralAlert;
