import ActionType from '@components/Home/Timeline/EventType';
import PublicationWrapper from '@components/Shared/PublicationWrapper';
import type { ElectedMirror, FeedItem, Publication } from '@lenster/lens';
import cn from '@lenster/ui/cn';
import type { FC } from 'react';

import PublicationActions from './Actions';
import ModAction from './Actions/ModAction';
import FeaturedChannel from './FeaturedChannel';
import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';
import PublicationType from './Type';

interface SinglePublicationProps {
  publication: Publication;
  feedItem?: FeedItem;
  showType?: boolean;
  showActions?: boolean;
  showModActions?: boolean;
  showThread?: boolean;
  showMore?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

const SinglePublication: FC<SinglePublicationProps> = ({
  publication,
  feedItem,
  showType = true,
  showActions = true,
  showModActions = false,
  showThread = true,
  showMore = true,
  isFirst = false,
  isLast = false
}) => {
  const firstComment = feedItem?.comments && feedItem.comments[0];
  const rootPublication = feedItem
    ? firstComment
      ? firstComment
      : feedItem?.root
    : publication;

  return (
    <PublicationWrapper
      className={cn(
        isFirst && 'rounded-t-xl',
        isLast && 'rounded-b-xl',
        'cursor-pointer p-3 hover:bg-gray-100 dark:hover:bg-gray-900 sm:p-5'
      )}
      publication={rootPublication}
    >
      {feedItem ? (
        <ActionType feedItem={feedItem} />
      ) : (
        <PublicationType
          publication={publication}
          showType={showType}
          showThread={showThread}
        />
      )}
      <PublicationHeader publication={rootPublication} feedItem={feedItem} />
      <div className="ml-[53px]">
        {publication?.hidden ? (
          <HiddenPublication type={publication.__typename} />
        ) : (
          <>
            <PublicationBody
              publication={rootPublication}
              showMore={showMore}
            />
            <div className="flex flex-wrap items-center gap-x-7">
              {showActions ? (
                <PublicationActions
                  publication={rootPublication}
                  electedMirror={feedItem?.electedMirror as ElectedMirror}
                />
              ) : null}
              <FeaturedChannel
                className="mt-3"
                tags={publication.metadata.tags}
              />
            </div>
            {showModActions ? (
              <ModAction
                publication={rootPublication}
                className="mt-3 max-w-md"
              />
            ) : null}
          </>
        )}
      </div>
    </PublicationWrapper>
  );
};

export default SinglePublication;
