import type { Comment, PublicationsRequest } from '@hey/lens';
import type { FC } from 'react';

import { useHiddenCommentFeedStore } from '@components/Publication';
import SinglePublication from '@components/Publication/SinglePublication';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import {
  CommentRankingFilterType,
  CustomFiltersType,
  HiddenCommentsType,
  LimitType,
  usePublicationsQuery
} from '@hey/lens';
import getAvatar from '@hey/lib/getAvatar';
import { Card, StackedAvatars } from '@hey/ui';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';

interface NoneRelevantFeedProps {
  publicationId: string;
}

const NoneRelevantFeed: FC<NoneRelevantFeedProps> = ({ publicationId }) => {
  const { showHiddenComments } = useHiddenCommentFeedStore();
  const [showMore, setShowMore] = useState(false);

  // Variables
  const request: PublicationsRequest = {
    limit: LimitType.TwentyFive,
    where: {
      commentOn: {
        hiddenComments: showHiddenComments
          ? HiddenCommentsType.HiddenOnly
          : HiddenCommentsType.Hide,
        id: publicationId,
        ranking: { filter: CommentRankingFilterType.NoneRelevant }
      },
      customFilters: [CustomFiltersType.Gardeners]
    }
  };

  const { data, fetchMore } = usePublicationsQuery({
    skip: !publicationId,
    variables: { request }
  });

  const comments = data?.publications?.items ?? [];
  const pageInfo = data?.publications?.pageInfo;
  const hasMore = pageInfo?.next;
  const totalComments = comments?.length;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  });

  if (totalComments === 0) {
    return null;
  }

  return (
    <>
      <Card
        className="flex cursor-pointer items-center justify-center space-x-2.5 p-5"
        onClick={() => {
          setShowMore(!showMore);
        }}
      >
        <StackedAvatars
          avatars={comments.map((comment) => getAvatar(comment.by))}
          limit={5}
        />
        <div>{showMore ? 'Hide more comments' : 'Show more comments'}</div>
        {showMore ? (
          <ChevronUpIcon className="size-4" />
        ) : (
          <ChevronDownIcon className="size-4" />
        )}
      </Card>
      {showMore ? (
        <Card className="divide-y-[1px] dark:divide-gray-700">
          {comments?.map((comment, index) =>
            comment?.__typename === 'Comment' && comment.isHidden ? null : (
              <SinglePublication
                isFirst={index === 0}
                isLast={index === comments.length - 1}
                key={`${publicationId}_${index}`}
                publication={comment as Comment}
                showType={false}
              />
            )
          )}
          {hasMore ? <span ref={observe} /> : null}
        </Card>
      ) : null}
    </>
  );
};

export default NoneRelevantFeed;
