import Slug from '@components/Shared/Slug';
import { HeartIcon } from '@heroicons/react/solid';
import formatHandle from '@lib/formatHandle';
import { Trans } from '@lingui/macro';
import type { ElectedMirror, Publication } from 'lens';
import type { FC } from 'react';

interface Props {
  mirror: Publication;
  referralFee?: number;
  electedMirror?: ElectedMirror;
}

const ReferralAlert: FC<Props> = ({ mirror, electedMirror, referralFee = 0 }) => {
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
