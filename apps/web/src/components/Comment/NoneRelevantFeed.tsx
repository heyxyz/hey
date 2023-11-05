import SinglePublication from '@components/Publication/SinglePublication';
import type { AnyPublication, Comment, PublicationsRequest } from '@hey/lens';
import {
  CommentRankingFilterType,
  CustomFiltersType,
  LimitType,
  usePublicationsQuery
} from '@hey/lens';
import { Card } from '@hey/ui';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useRef, useState } from 'react';
import { type StateSnapshot, Virtuoso } from 'react-virtuoso';

let virtuosoState: any = { ranges: [], screenTop: 0 };

interface NoneRelevantFeedProps {
  publication?: AnyPublication;
}

const NoneRelevantFeed: FC<NoneRelevantFeedProps> = ({ publication }) => {
  const publicationId =
    publication?.__typename === 'Mirror'
      ? publication?.mirrorOn?.id
      : publication?.id;
  const [showMore, setShowMore] = useState(false);

  const virtuosoRef = useRef<any>();

  // Variables
  const request: PublicationsRequest = {
    where: {
      commentOn: {
        id: publicationId,
        ranking: { filter: CommentRankingFilterType.NoneRelevant }
      },
      customFilters: [CustomFiltersType.Gardeners]
    },
    limit: LimitType.TwentyFive
  };

  const { data, fetchMore } = usePublicationsQuery({
    variables: { request },
    skip: !publicationId
  });

  const comments = data?.publications?.items ?? [];
  const pageInfo = data?.publications?.pageInfo;
  const hasMore = pageInfo?.next;
  const totalComments = comments?.length;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  const onScrolling = (scrolling: boolean) => {
    virtuosoRef?.current?.getState((state: StateSnapshot) => {
      if (!scrolling) {
        virtuosoState = { ...state };
      }
    });
  };

  if (totalComments === 0) {
    return null;
  }

  return (
    <>
      <Card
        className="cursor-pointer p-5 text-center"
        onClick={() => {
          setShowMore(!showMore);
        }}
      >
        {showMore ? 'Hide more comments' : 'Show more comments'}
      </Card>
      {showMore ? (
        <Card className="divide-y-[1px] dark:divide-gray-700">
          {comments?.length ? (
            <Virtuoso
              useWindowScroll
              restoreStateFrom={
                virtuosoState.ranges.length === 0
                  ? virtuosoRef?.current?.getState(
                      (state: StateSnapshot) => state
                    )
                  : virtuosoState
              }
              ref={virtuosoRef}
              data={comments.filter(
                (comment) =>
                  comment?.__typename === 'Comment' && !comment.isHidden
              )}
              isScrolling={onScrolling}
              endReached={onEndReached}
              className="virtual-feed-list"
              itemContent={(index, comment) => {
                return (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <SinglePublication
                      key={`${publicationId}_${index}`}
                      isFirst={index === 0}
                      isLast={index === comments.length - 1}
                      publication={comment as Comment}
                      showType={false}
                    />
                  </motion.div>
                );
              }}
            />
          ) : null}
        </Card>
      ) : null}
    </>
  );
};

export default NoneRelevantFeed;
