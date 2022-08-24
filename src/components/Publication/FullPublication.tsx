import UserProfile from '@components/Shared/UserProfile';
import { LensterPublication } from '@generated/lenstertypes';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { FC } from 'react';

import PublicationActions from './Actions';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationStats from './PublicationStats';
import PublicationType from './Type';

dayjs.extend(relativeTime);

interface Props {
  publication: LensterPublication;
}

const FullPublication: FC<Props> = ({ publication }) => {
  const publicationType = publication?.metadata?.attributes[0]?.value;
  const isMirror = publication?.__typename === 'Mirror';
  const profile = isMirror ? publication?.mirrorOf?.profile : publication?.profile;
  const timestamp = isMirror ? publication?.mirrorOf?.createdAt : publication?.createdAt;

  // Count check to show the publication stats only if the publication has a comment, like or collect
  const mirrorCount = isMirror
    ? publication?.mirrorOf?.stats?.totalAmountOfMirrors
    : publication?.stats?.totalAmountOfMirrors;
  const reactionCount = isMirror
    ? publication?.mirrorOf?.stats?.totalUpvotes
    : publication?.stats?.totalUpvotes;
  const collectCount = isMirror
    ? publication?.mirrorOf?.stats?.totalAmountOfCollects
    : publication?.stats?.totalAmountOfCollects;
  const showStats = mirrorCount > 0 || reactionCount > 0 || collectCount > 0;

  return (
    <article className="p-5">
      <PublicationType publication={publication} showType />
      <div>
        <div className="flex justify-between pb-4 space-x-1.5">
          <UserProfile
            profile={
              publicationType === 'community' && !!publication?.collectedBy?.defaultProfile
                ? publication?.collectedBy?.defaultProfile
                : profile
            }
          />
        </div>
        <div className="ml-[53px]">
          {publication?.hidden ? (
            <HiddenPublication type={publication?.__typename} />
          ) : (
            <>
              <PublicationBody publication={publication} />
              <div className="text-[15px] text-gray-500 my-3">
                {dayjs(new Date(timestamp)).format('hh:mm A · MMM D, YYYY')}
              </div>
              {showStats && (
                <>
                  <div className="divider" />
                  <PublicationStats publication={publication} />
                </>
              )}
              <div className="divider" />
              <PublicationActions publication={publication} isFullPublication />
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default FullPublication;
