import EventType from '@components/Home/Timeline/EventType';
import UserProfile from '@components/Shared/UserProfile';
import type { LensterPublication } from '@generated/types';
import { Analytics } from '@lib/analytics';
import formatTime from '@lib/formatTime';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { ElectedMirror, FeedItem } from 'lens';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { PUBLICATION } from 'src/tracking';

import PublicationActions from './Actions';
import ModAction from './Actions/ModAction';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationType from './Type';

dayjs.extend(relativeTime);

interface Props {
  publication: LensterPublication;
  feedItem?: FeedItem;
  showType?: boolean;
  showActions?: boolean;
  showModActions?: boolean;
  showThread?: boolean;
}

const SinglePublication: FC<Props> = ({
  publication,
  feedItem,
  showType = true,
  showActions = true,
  showModActions = false,
  showThread = true
}) => {
  const { push } = useRouter();
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
    <article className="hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer first:rounded-t-xl last:rounded-b-xl p-5">
      {feedItem ? (
        <EventType feedItem={feedItem} showType={showType} showThread={showThread} />
      ) : (
        <PublicationType publication={publication} showType={showType} showThread={showThread} />
      )}
      <div className="flex justify-between pb-4 space-x-1.5">
        <span onClick={(event) => event.stopPropagation()}>
          <UserProfile profile={profile ?? publication?.collectedBy?.defaultProfile} showStatus />
        </span>
        <span className="text-xs text-gray-500" title={formatTime(timestamp)}>
          {dayjs(new Date(timestamp)).fromNow()}
        </span>
      </div>
      <div
        className="ml-[53px]"
        onClick={() => {
          const selection = window.getSelection();
          if (!selection || selection.toString().length === 0) {
            Analytics.track(PUBLICATION.OPEN);
            push(`/posts/${rootPublication?.id}`);
          }
        }}
      >
        {publication?.hidden ? (
          <HiddenPublication type={publication.__typename} />
        ) : (
          <>
            <PublicationBody publication={rootPublication as LensterPublication} />
            {showActions && (
              <PublicationActions
                publication={rootPublication as LensterPublication}
                electedMirror={feedItem?.electedMirror as ElectedMirror}
              />
            )}
            {showModActions && <ModAction publication={rootPublication as LensterPublication} />}
          </>
        )}
      </div>
    </article>
  );
};

export default SinglePublication;
