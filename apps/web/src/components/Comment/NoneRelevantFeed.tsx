import SinglePublication from '@components/Publication/SinglePublication';
import { Card } from '@components/UI/Card';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import { Trans } from '@lingui/macro';
import { SCROLL_THRESHOLD } from 'data/constants';
import type { Comment, Publication, PublicationsQueryRequest } from 'lens';
import {
  CommentOrderingTypes,
  CommentRankingFilter,
  CustomFiltersTypes,
  useCommentFeedLazyQuery
} from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppStore } from 'src/store/app';

interface Props {
  publication?: Publication;
}

const NoneRelevantFeed: FC<Props> = ({ publication }) => {
  const publicationId = publication?.__typename === 'Mirror' ? publication?.mirrorOf?.id : publication?.id;
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [showNoneRelevant, setShowNoneRelevant] = useState(false);

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

  const [fetchNoneRelevantComments, { data, loading, fetchMore }] = useCommentFeedLazyQuery({
    variables: { request, reactionRequest, profileId },
    fetchPolicy: 'no-cache'
  });

  const comments = data?.publications?.items ?? [];
  const pageInfo = data?.publications?.pageInfo;
  const totalComments = comments?.length;
  const hasMore = pageInfo?.next;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
    });
  };

  return (
    <>
      <Card
        className="flex cursor-pointer items-center justify-center space-x-2 p-5"
        onClick={() => {
          setShowNoneRelevant(!showNoneRelevant);
          if (!showNoneRelevant) {
            fetchNoneRelevantComments();
          }
        }}
      >
        <div>{showNoneRelevant ? <Trans>Hide more comments</Trans> : <Trans>Show more comments</Trans>}</div>
      </Card>
      {comments?.length > 0 && showNoneRelevant ? (
        <InfiniteScroll
          dataLength={totalComments}
          scrollThreshold={SCROLL_THRESHOLD}
          hasMore={hasMore}
          next={loadMore}
          loader={<InfiniteLoader />}
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
