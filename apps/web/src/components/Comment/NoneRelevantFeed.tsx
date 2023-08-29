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
import { For } from 'million/react';
import type { FC } from 'react';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';
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
  const hasMore = pageInfo?.next;
  const totalComments = comments?.length;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      await fetchMore({
        variables: {
          request: { ...request, cursor: pageInfo?.next },
          reactionRequest,
          profileId
        }
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
        dataTestId="none-relevant-feed"
      >
        {showMore ? (
          <Trans>Hide more comments</Trans>
        ) : (
          <Trans>Show more comments</Trans>
        )}
      </Card>
      {showMore ? (
        <Card className="divide-y-[1px] dark:divide-gray-700">
          {comments && (
            <For
              each={comments.filter(
                (comment) =>
                  !(comment?.__typename === 'Comment' && comment.hidden)
              )}
            >
              {(comment, index) => (
                <SinglePublication
                  showType={false}
                  isFirst={index === 0}
                  publication={comment as Comment}
                  key={`${publicationId}_${index}`}
                  isLast={index === comments.length - 1}
                />
              )}
            </For>
          )}
          {hasMore ? <span ref={observe} /> : null}
        </Card>
      ) : null}
    </>
  );
};

export default NoneRelevantFeed;
