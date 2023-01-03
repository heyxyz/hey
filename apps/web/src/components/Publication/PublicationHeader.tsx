import UserProfile from '@components/Shared/UserProfile';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import type { LensterPublication } from '@generated/types';
import clsx from 'clsx';
import type { FeedItem } from 'lens';
import type { FC } from 'react';

import PublicationMenu from './Actions/Menu';
import Source from './Source';

interface Props {
  publication: LensterPublication;
  className?: string;
  feedItem?: FeedItem;
}

const PublicationHeader: FC<Props> = ({ publication, className = '', feedItem }) => {
  const { allowed: staffMode } = useStaffMode();
  const isMirror = publication.__typename === 'Mirror';
  const firstComment = feedItem?.comments && feedItem.comments[0];
  const rootPublication = feedItem ? (firstComment ? firstComment : feedItem?.root) : publication;
  const profile = feedItem
    ? rootPublication.profile
    : isMirror
    ? publication?.mirrorOf?.profile
    : publication?.profile;
  const timestamp = feedItem
    ? rootPublication.createdAt
    : isMirror
    ? publication?.mirrorOf?.createdAt
    : publication?.createdAt;

  return (
    <div className={clsx('flex justify-between space-x-1.5', className)}>
      <span onClick={(event) => event.stopPropagation()}>
        <UserProfile
          profile={profile ?? publication?.collectedBy?.defaultProfile}
          timestamp={timestamp}
          showStatus
        />
      </span>
      <div className="flex items-center space-x-1">
        {staffMode && <Source publication={publication} />}
        <PublicationMenu publication={publication} />
      </div>
    </div>
  );
};

export default PublicationHeader;
