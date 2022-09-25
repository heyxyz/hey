import { gql, useQuery } from '@apollo/client';
import QueuedPublication from '@components/Publication/QueuedPublication';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { LensterPublication } from '@generated/lenstertypes';
import { CommentFields } from '@gql/CommentFields';
import { MirrorFields } from '@gql/MirrorFields';
import { PostFields } from '@gql/PostFields';
import { CollectionIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import React, { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { PAGINATION_ROOT_MARGIN } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { usePublicationPersistStore } from 'src/store/publication';
import { PAGINATION } from 'src/tracking';

const HOME_FEED_QUERY = gql`
  query HomeFeed(
    $request: TimelineRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    timeline(request: $request) {
      items {
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
  ${PostFields}
  ${MirrorFields}
  ${CommentFields}
`;

const Feed: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const txnQueue = usePublicationPersistStore((state) => state.txnQueue);

  // Variables
  const request = { profileId: currentProfile?.id, limit: 10 };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useQuery(HOME_FEED_QUERY, {
    variables: { request, reactionRequest, profileId }
  });

  const pageInfo = data?.timeline?.pageInfo;
  const { observe } = useInView({
    onEnter: async () => {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
      });
      Mixpanel.track(PAGINATION.HOME_FEED);
    },
    rootMargin: PAGINATION_ROOT_MARGIN
  });

  return (
    <>
      {loading && <PublicationsShimmer />}
      {data?.timeline?.items?.length === 0 && (
        <EmptyState
          message={<div>No posts yet!</div>}
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load home feed" error={error} />
      {!error && !loading && data?.timeline?.items?.length !== 0 && (
        <>
          <Card className="divide-y-[1px] dark:divide-gray-700/80">
            {txnQueue.map(
              (txn) =>
                txn?.type === 'NEW_POST' && (
                  <div key={txn.id}>
                    <QueuedPublication txn={txn} />
                  </div>
                )
            )}
            {data?.timeline?.items?.map((post: LensterPublication, index: number) => (
              <SinglePublication key={`${post?.id}_${index}`} publication={post} />
            ))}
          </Card>
          {pageInfo?.next && data?.timeline?.items?.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-5">
              <Spinner size="sm" />
            </span>
          )}
        </>
      )}
    </>
  );
};

export default Feed;
