import EventType from '@components/Home/Timeline/EventType';
import { Analytics } from '@lib/analytics';
import type { ElectedMirror, FeedItem, Publication } from 'lens';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { PUBLICATION } from 'src/tracking';

import PublicationActions from './Actions';
import ModAction from './Actions/ModAction';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';
import PublicationType from './Type';

interface Props {
  publication: Publication;
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
  const firstComment = feedItem?.comments && feedItem.comments[0];
  const rootPublication = feedItem ? (firstComment ? firstComment : feedItem?.root) : publication;

  return (
    <article
      className="cursor-pointer p-5 first:rounded-t-xl last:rounded-b-xl hover:bg-gray-100 dark:hover:bg-gray-900"
      onClick={() => {
        const selection = window.getSelection();
        if (!selection || selection.toString().length === 0) {
          Analytics.track(PUBLICATION.OPEN);
          push(`/posts/${rootPublication?.id}`);
        }
      }}
    >
      {feedItem ? (
        <EventType feedItem={feedItem} showType={showType} showThread={showThread} />
      ) : (
        <PublicationType publication={publication} showType={showType} showThread={showThread} />
      )}
      <PublicationHeader className="pb-4" publication={rootPublication} feedItem={feedItem} />
      <div className="ml-[53px]">
        {publication?.hidden ? (
          <HiddenPublication type={publication.__typename} />
        ) : (
          <>
            <PublicationBody publication={rootPublication} />
            {showActions && (
              <PublicationActions
                publication={rootPublication}
                electedMirror={feedItem?.electedMirror as ElectedMirror}
              />
            )}
            {showModActions && <ModAction publication={rootPublication} />}
          </>
        )}
      </div>
    </article>
  );
};

export default SinglePublication;
