import type { AnyPublication, Comment, PublicationsRequest } from '@hey/lens';
import {
  CommentRankingFilterType,
  CustomFiltersType,
  LimitType,
  usePublicationsQuery
} from '@hey/lens';
import { Card } from '@hey/ui';
import type { FC } from 'react';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';

import SinglePublication from '@/components/Publication/SinglePublication';

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
                key={`${publicationId}_${index}`}
                isFirst={index === 0}
                isLast={index === comments.length - 1}
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
