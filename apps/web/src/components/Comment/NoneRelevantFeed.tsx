import SinglePublication from '@components/Publication/SinglePublication';
import type {
  Comment,
  Publication,
  PublicationsQueryRequest
} from '@lenster/lens';
import {
  CommentOrderingTypes,
  CommentRankingFilter,
  CustomFiltersTypes,
  useCommentFeedQuery
} from '@lenster/lens';
import { Card } from '@lenster/ui';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useAppStore } from 'src/store/app';

interface NoneRelevantFeedProps {
  publication?: Publication;
}

const NoneRelevantFeed: FC<NoneRelevantFeedProps> = ({ publication }) => {
  const publicationId =
    publication?.__typename === 'Mirror'
      ? publication?.mirrorOf?.id
      : publication?.id;
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [hasMore, setHasMore] = useState(true);
  const [showMore, setShowMore] = useState(false);

  // Variables
  const request: PublicationsQueryRequest = {
    commentsOf: publicationId,
    customFilters: [CustomFiltersTypes.Gardeners],
    commentsOfOrdering: CommentOrderingTypes.Ranking,
    commentsRankingFilter: CommentRankingFilter.NoneRelevant,
    limit: 30
  };
  const reactionRequest = currentProfile
    ? { profileId: currentProfile?.id }
    : null;
  const profileId = currentProfile?.id ?? null;

  const { data, fetchMore } = useCommentFeedQuery({
    variables: { request, reactionRequest, profileId },
    skip: !publicationId
  });

  const comments = data?.publications?.items ?? [];
  const pageInfo = data?.publications?.pageInfo;
  const totalComments = comments?.length;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    await fetchMore({
      variables: {
        request: { ...request, cursor: pageInfo?.next },
        reactionRequest,
        profileId
      }
    }).then(({ data }) => {
      setHasMore(data?.publications?.items?.length > 0);
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
        dataTestId="none-relevant-feed"
      >
        {showMore ? (
          <Trans>Hide more comments</Trans>
        ) : (
          <Trans>Show more comments</Trans>
        )}
      </Card>
      {showMore ? (
        <Card>
          <Virtuoso
            useWindowScroll
            className="virtual-feed"
            data={comments}
            endReached={onEndReached}
            itemContent={(index, comment) => {
              return comment?.__typename === 'Comment' &&
                comment.hidden ? null : (
                <SinglePublication
                  key={`${publicationId}_${index}`}
                  isFirst={index === 0}
                  isLast={index === comments.length - 1}
                  publication={comment as Comment}
                  showType={false}
                />
              );
            }}
          />
        </Card>
      ) : null}
    </>
  );
};

export default NoneRelevantFeed;
