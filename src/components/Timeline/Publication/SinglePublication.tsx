import PublicationActions from '@components/Publication/Actions';
import ModAction from '@components/Publication/Actions/ModAction';
import HiddenPublication from '@components/Publication/HiddenPublication';
import PublicationBody from '@components/Publication/PublicationBody';
import UserProfile from '@components/Shared/UserProfile';
import type { LensterPublication } from '@generated/lenstertypes';
import type { ElectedMirror, FeedItem } from '@generated/types';
import { Leafwatch } from '@lib/leafwatch';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { PUBLICATION } from 'src/tracking';

import EventType from './EventType';

dayjs.extend(relativeTime);

interface Props {
  feedItem: FeedItem;
  showType?: boolean;
  showActions?: boolean;
  showModActions?: boolean;
  showThread?: boolean;
}

const SinglePublication: FC<Props> = ({
  feedItem,
  showType = true,
  showActions = true,
  showModActions = false,
  showThread = true
}) => {
  const { push } = useRouter();
  const firstComment = feedItem.comments && feedItem.comments[0];
  const publication = firstComment ? firstComment : feedItem.root;
  const timestamp = publication?.createdAt;
  const profile = publication.profile;

  return (
    <article className="hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer first:rounded-t-xl last:rounded-b-xl p-5">
      <EventType feedItem={feedItem} showType={showType} showThread={showThread} />
      <div className="flex justify-between pb-4 space-x-1.5">
        <span onClick={(event) => event.stopPropagation()}>
          <UserProfile profile={profile ?? publication?.collectedBy?.defaultProfile} />
        </span>
        <span className="text-xs text-gray-500">{dayjs(new Date(timestamp)).fromNow()}</span>
      </div>
      <div
        className="ml-[53px]"
        onClick={() => {
          push(`/posts/${publication?.id}`);
          Leafwatch.track(PUBLICATION.OPEN);
        }}
      >
        {publication?.hidden ? (
          <HiddenPublication type={publication.__typename} />
        ) : (
          <>
            <PublicationBody publication={publication as LensterPublication} />
            {showActions && (
              <PublicationActions
                publication={publication as LensterPublication}
                electedMirror={feedItem.electedMirror as ElectedMirror}
              />
            )}
            {showModActions && <ModAction publication={publication as LensterPublication} />}
          </>
        )}
      </div>
    </article>
  );
};

export default SinglePublication;
