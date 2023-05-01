import UserProfile from '@components/Shared/UserProfile';
import useModMode from '@components/utils/hooks/useModMode';
import type { FeedItem, Publication } from 'lens';
import { stopEventPropagation } from 'lib/stopEventPropagation';
import type { FC } from 'react';

import PublicationMenu from './Actions/Menu';
import Source from './Source';

interface PublicationHeaderProps {
  publication: Publication;
  feedItem?: FeedItem;
}

const PublicationHeader: FC<PublicationHeaderProps> = ({
  publication,
  feedItem
}) => {
  const { allowed: modMode } = useModMode();
  const isMirror = publication.__typename === 'Mirror';
  const firstComment = feedItem?.comments && feedItem.comments[0];
  const rootPublication = feedItem
    ? firstComment
      ? firstComment
      : feedItem?.root
    : publication;
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
    <div
      className="relative flex justify-between space-x-1.5 pb-4"
      data-testid={`publication-${publication.id}-header`}
    >
      <span onClick={stopEventPropagation} aria-hidden="true">
        <UserProfile profile={profile} timestamp={timestamp} showStatus />
      </span>
      <div className="!-mr-[7px] flex items-center space-x-1">
        {modMode && <Source publication={publication} />}
        {!publication.hidden && <PublicationMenu publication={publication} />}
      </div>
    </div>
  );
};

export default PublicationHeader;
