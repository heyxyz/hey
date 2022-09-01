import UserProfile from '@components/Shared/UserProfile';
import { LensterPublication } from '@generated/lenstertypes';
import { Mixpanel } from '@lib/mixpanel';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/router';
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
  const { push } = useRouter();
  const isMirror = publication?.__typename === 'Mirror';
  const profile = isMirror ? publication?.mirrorOf?.profile : publication?.profile;
  const timestamp = isMirror ? publication?.mirrorOf?.createdAt : publication?.createdAt;

  return (
    <article className="first:rounded-t-xl last:rounded-b-xl p-5 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
      <PublicationType publication={publication} showType={showType} showThread={showThread} />
      <div
        onClick={() => {
          push(`/posts/${publication?.id}`);
          Mixpanel.track(PUBLICATION.OPEN);
        }}
      >
        <div className="flex justify-between pb-4 space-x-1.5">
          <span onClick={(event) => event.stopPropagation()}>
            <UserProfile profile={profile ?? publication?.collectedBy?.defaultProfile} />
          </span>
          <span className="text-xs text-gray-500">{dayjs(new Date(timestamp)).fromNow()}</span>
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
