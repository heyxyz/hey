import SinglePublication from '@components/Publication/SinglePublication';
import { Card } from '@components/UI/Card';
import { Trans } from '@lingui/macro';
import { SCROLL_THRESHOLD } from 'data/constants';
import type { Comment, Publication, PublicationsQueryRequest } from 'lens';
import { CommentOrderingTypes, CommentRankingFilter, CustomFiltersTypes, useCommentFeedQuery } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppStore } from 'src/store/app';

let hasMore = true;

interface NoneRelevantFeedProps {
  publication?: Publication;
}

const NoneRelevantFeed: FC<NoneRelevantFeedProps> = ({ publication }) => {
  const publicationId = publication?.__typename === 'Mirror' ? publication?.mirrorOf?.id : publication?.id;
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [showMore, setShowMore] = useState(false);

  // Variables
  const request: PublicationsQueryRequest = {
    commentsOf: publicationId,
    customFilters: [CustomFiltersTypes.Gardeners],
    commentsOfOrdering: CommentOrderingTypes.Ranking,
    commentsRankingFilter: CommentRankingFilter.NoneRelevant,
    limit: 10
  };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const { data, fetchMore } = useCommentFeedQuery({
    variables: { request, reactionRequest, profileId },
    skip: !publicationId
  });

  const comments = data?.publications?.items ?? [];
  const pageInfo = data?.publications?.pageInfo;

  const totalComments = comments?.length;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
    }).then(({ data }) => {
      hasMore = data?.publications?.items?.length > 0;
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
        {showMore ? <Trans>Hide more comments</Trans> : <Trans>Show more comments</Trans>}
      </Card>
      {showMore ? (
        <InfiniteScroll
          dataLength={totalComments}
          scrollThreshold={SCROLL_THRESHOLD}
          hasMore={hasMore}
          next={loadMore}
          loader={<span />}
        >
          <Card className="divide-y-[1px] dark:divide-gray-700">
            {comments?.map((comment, index) =>
              comment?.__typename === 'Comment' && comment.hidden ? null : (
                <SinglePublication
                  key={`${publicationId}_${index}`}
                  publication={comment as Comment}
                  showType={false}
                />
              )
            )}
          </Card>
        </InfiniteScroll>
      ) : null}
    </>
  );
};

export default NoneRelevantFeed;
