import TimelinePublicationType from '@components/Home/Timeline/TimelinePublicationType';
import TimelineThreads from '@components/Home/Timeline/TimelinePublicationType/Threads';
import clsx from 'clsx';
import type { ElectedMirror, FeedItem, Publication } from 'lens';
import { useRouter } from 'next/router';
import type { FC } from 'react';

import PublicationActions from './Actions';
import ModAction from './Actions/ModAction';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';
import PublicationType from './Type';
import PublicationThreads from './Type/PublicationThreads';

interface SinglePublicationProps {
  publication: Publication;
  feedItem?: FeedItem;
  showType?: boolean;
  showActions?: boolean;
  showModActions?: boolean;
  showThread?: boolean;
  index?: number;
}

const SinglePublication: FC<SinglePublicationProps> = ({
  publication,
  feedItem,
  showType = true,
  showActions = true,
  showModActions = false,
  showThread = false,
  index
}) => {
  const { push } = useRouter();
  const firstComment = feedItem?.comments && feedItem.comments[0];
  const rootPublication = feedItem ? (firstComment ? firstComment : feedItem?.root) : publication;

  return (
    <div
      className={clsx({ 'first-of-type:[&_article]:rounded-t-xl': index === 0 }, 'last:rounded-b-xl')}
      data-testid={`publication-${publication.id}`}
    >
      {feedItem ? (
        <TimelineThreads feedItem={feedItem} />
      ) : (
        <PublicationThreads publication={publication} showThread={showThread} />
      )}
      <article
        className="cursor-pointer px-5 pt-3 pb-5 hover:bg-gray-100 dark:hover:bg-gray-900"
        onClick={() => {
          const selection = window.getSelection();
          if (!selection || selection.toString().length === 0) {
            push(`/posts/${rootPublication?.id}`);
          }
        }}
      >
        {feedItem ? (
          <TimelinePublicationType feedItem={feedItem} />
        ) : (
          <PublicationType publication={publication} showType={showType} />
        )}
        <PublicationHeader publication={rootPublication} feedItem={feedItem} />
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
              {showModActions && <ModAction publication={rootPublication} className="mt-3 max-w-md" />}
            </>
          )}
        </div>
      </article>
    </div>
  );
};

export default SinglePublication;
