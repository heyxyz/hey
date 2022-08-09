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
}

const SinglePublication: FC<Props> = ({ publication, showType = true, showActions = true }) => {
  const publicationType = publication?.metadata?.attributes[0]?.value;

  return (
    <Link href={`/posts/${publication?.id ?? publication?.pubId}`} passHref>
      <article
        className="cursor-pointer first:rounded-t-xl last:rounded-b-xl hover:bg-gray-100/70 hover:dark:bg-gray-800/70 p-5"
        onClick={() => {
          Mixpanel.track(PUBLICATION.OPEN);
        }}
      >
        <PublicationType publication={publication} showType={showType} showThread />
        <div>
          <div className="flex justify-between pb-4 space-x-1.5">
            <UserProfile
              profile={
                publicationType === 'community' && !!publication?.collectedBy?.defaultProfile
                  ? publication?.collectedBy?.defaultProfile
                  : publication?.__typename === 'Mirror'
                  ? publication?.mirrorOf?.profile
                  : publication?.profile
              }
            />
            <span className="text-sm text-gray-500">{dayjs(new Date(publication?.createdAt)).fromNow()}</span>
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
    </Link>
  );
};

export default SinglePublication;
