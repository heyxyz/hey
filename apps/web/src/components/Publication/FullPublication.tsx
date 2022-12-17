import UserProfile from '@components/Shared/UserProfile';
import type { LensterPublication } from '@generated/types';
import formatTime from '@lib/formatTime';
import getAppName from '@lib/getAppName';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { FC } from 'react';

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
  const isMirror = publication.__typename === 'Mirror';
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
          <UserProfile profile={profile ?? publication?.collectedBy?.defaultProfile} />
        </div>
        <div className="ml-[53px]">
          {publication?.hidden ? (
            <HiddenPublication type={publication.__typename} />
          ) : (
            <>
              <PublicationBody publication={publication} />
              <div className="text-sm lt-text-gray-500 my-3">
                <span title={formatTime(timestamp)}>
                  {dayjs(new Date(timestamp)).format('hh:mm A · MMM D, YYYY')}
                </span>
                {publication?.appId ? <span> · Posted via {getAppName(publication?.appId)}</span> : null}
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
