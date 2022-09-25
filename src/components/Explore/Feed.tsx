import { gql, useQuery } from '@apollo/client';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { LensterPublication } from '@generated/lenstertypes';
import { CustomFiltersTypes, PublicationSortCriteria } from '@generated/types';
import { CommentFields } from '@gql/CommentFields';
import { MirrorFields } from '@gql/MirrorFields';
import { PostFields } from '@gql/PostFields';
import { CollectionIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import React, { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { PAGINATION_ROOT_MARGIN } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PAGINATION } from 'src/tracking';

export const EXPLORE_FEED_QUERY = gql`
  query ExploreFeed(
    $request: ExplorePublicationRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    explorePublications(request: $request) {
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
        totalCount
        next
      }
    }
  }
  ${PostFields}
  ${CommentFields}
  ${MirrorFields}
`;

interface Props {
  feedType?: string;
}

const Feed: FC<Props> = ({ feedType = PublicationSortCriteria.CuratedProfiles }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Variables
  const request = {
    sortCriteria: feedType,
    noRandomize: feedType === 'LATEST',
    customFilters: [CustomFiltersTypes.Gardeners],
    limit: 10
  };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useQuery(EXPLORE_FEED_QUERY, {
    variables: { request, reactionRequest, profileId }
  });

  const pageInfo = data?.explorePublications?.pageInfo;
  const publications = data?.explorePublications?.items;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
      });
      Mixpanel.track(PAGINATION.EXPLORE_FEED);
    },
    rootMargin: PAGINATION_ROOT_MARGIN
  });

  return (
    <>
      {loading && <PublicationsShimmer />}
      {publications?.length === 0 && (
        <EmptyState
          message={<div>No posts yet!</div>}
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load explore feed" error={error} />
      {!error && !loading && publications?.length !== 0 && (
        <>
          <Card className="divide-y-[1px] dark:divide-gray-700/80">
            {publications?.map((post: LensterPublication, index: number) => {
              const isLast = index === publications.length - 1;

              return (
                <SinglePublication
                  key={`${post?.id}_${index}`}
                  fwdRef={isLast ? observe : null}
                  publication={post}
                />
              );
            })}
          </Card>
          {pageInfo?.next && publications?.length !== pageInfo?.totalCount && (
            <span className="flex justify-center p-5">
              <Spinner size="sm" />
            </span>
          )}
        </>
      )}
    </>
  );
};

export default Feed;
