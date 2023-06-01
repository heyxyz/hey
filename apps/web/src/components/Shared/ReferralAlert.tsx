import Slug from '@components/Shared/Slug';
import { HeartIcon } from '@heroicons/react/solid';
import type { ElectedMirror, Publication } from '@lenster/lens';
import formatHandle from '@lenster/lib/formatHandle';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';

interface ReferralAlertProps {
  mirror: Publication;
  referralFee?: number;
  electedMirror?: ElectedMirror;
}

const ReferralAlert: FC<ReferralAlertProps> = ({
  mirror,
  electedMirror,
  referralFee = 0
}) => {
  if ((mirror.__typename !== 'Mirror' && !electedMirror) || referralFee === 0) {
    return null;
  }
  const publication = electedMirror ?? mirror;

  return (
    <div className="lt-text-gray-500 flex items-center space-x-1.5 pt-1 text-sm">
      <HeartIcon className="h-4 w-4 text-pink-500" />
      <Slug slug={formatHandle(publication?.profile?.handle)} prefix="@" />
      <span>
        {' '}
        <Trans>
          will get <b>{referralFee}%</b> referral fee
        </Trans>
      </span>
    </div>
  );
};

export default ReferralAlert;
