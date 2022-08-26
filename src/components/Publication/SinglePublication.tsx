import UserProfile from '@components/Shared/UserProfile';
import { LensterPublication } from '@generated/lenstertypes';
import { Mixpanel } from '@lib/mixpanel';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import React, { FC } from 'react';
import { PUBLICATION } from 'src/tracking';

import PublicationActions from './Actions';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationType from './Type';

dayjs.extend(relativeTime);

interface Props {
  publication: LensterPublication;
  showType?: boolean;
  showActions?: boolean;
  showThread?: boolean;
}

const SinglePublication: FC<Props> = ({
  publication,
  showType = true,
  showActions = true,
  showThread = true
}) => {
  const isMirror = publication?.__typename === 'Mirror';
  const profile = isMirror ? publication?.mirrorOf?.profile : publication?.profile;
  const timestamp = isMirror ? publication?.mirrorOf?.createdAt : publication?.createdAt;

  return (
    <article
      className="first:rounded-t-xl last:rounded-b-xl p-5"
      onClick={() => {
        Mixpanel.track(PUBLICATION.OPEN);
      }}
    >
      <PublicationType publication={publication} showType={showType} showThread={showThread} />
      <div>
        <div className="flex justify-between pb-4 space-x-1.5">
          <UserProfile profile={publication?.collectedBy?.defaultProfile ?? profile} />
          <Link href={`/posts/${publication?.id}`} className="text-sm text-gray-500">
            <span>{dayjs(new Date(timestamp)).fromNow()}</span>
          </Link>
        </div>
        <div className="ml-[53px]">
          {publication?.hidden ? (
            <HiddenPublication type={publication?.__typename} />
          ) : (
            <>
              <PublicationBody publication={publication} />
              {showActions && <PublicationActions publication={publication} />}
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default SinglePublication;
