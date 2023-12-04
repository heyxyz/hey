import type { AnyPublication, Comment, PublicationsRequest } from '@hey/lens';
import type { FC } from 'react';

import SinglePublication from '@components/Publication/SinglePublication';
import {
  CommentRankingFilterType,
  CustomFiltersType,
  LimitType,
  usePublicationsQuery
} from '@hey/lens';
import { Card } from '@hey/ui';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';

interface NoneRelevantFeedProps {
  publication?: AnyPublication;
}

const NoneRelevantFeed: FC<NoneRelevantFeedProps> = ({ publication }) => {
  const publicationId =
    publication?.__typename === 'Mirror'
      ? publication?.mirrorOn?.id
      : publication?.id;
  const [showMore, setShowMore] = useState(false);

  // Variables
  const request: PublicationsRequest = {
    limit: LimitType.TwentyFive,
    where: {
      commentOn: {
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
        className="cursor-pointer p-5 text-center"
        onClick={() => {
          setShowMore(!showMore);
        }}
      >
        {showMore ? 'Hide more comments' : 'Show more comments'}
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
