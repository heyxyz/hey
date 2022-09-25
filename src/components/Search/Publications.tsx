import { gql, useQuery } from '@apollo/client';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { LensterPublication } from '@generated/lenstertypes';
import { CustomFiltersTypes } from '@generated/types';
import { CommentFields } from '@gql/CommentFields';
import { PostFields } from '@gql/PostFields';
import { CollectionIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import React, { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { PAGINATION_ROOT_MARGIN } from 'src/constants';
import { useAppStore } from 'src/store/app';
import { PAGINATION } from 'src/tracking';

const SEARCH_PUBLICATIONS_QUERY = gql`
  query SearchPublications(
    $request: SearchQueryRequest!
    $reactionRequest: ReactionFieldResolverRequest
    $profileId: ProfileId
  ) {
    search(request: $request) {
      ... on PublicationSearchResult {
        items {
          ... on Post {
            ...PostFields
          }
          ... on Comment {
            ...CommentFields
          }
        }
        pageInfo {
          next
          totalCount
        }
      }
    }
  }
  ${PostFields}
  ${CommentFields}
`;

interface Props {
  query: string | string[];
}

const Publications: FC<Props> = ({ query }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Variables
  const request = {
    query,
    type: 'PUBLICATION',
    customFilters: [CustomFiltersTypes.Gardeners],
    limit: 10
  };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore } = useQuery(SEARCH_PUBLICATIONS_QUERY, {
    variables: { request, reactionRequest, profileId }
  });

  const pageInfo = data?.search?.pageInfo;
  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
      });
      Mixpanel.track(PAGINATION.PUBLICATION_SEARCH);
    },
    rootMargin: PAGINATION_ROOT_MARGIN
  });

  return (
    <>
      {loading && <PublicationsShimmer />}
      {data?.search?.items?.length === 0 && (
        <EmptyState
          message={
            <div>
              No publications for <b>&ldquo;{query}&rdquo;</b>
            </div>
          }
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load publications list" error={error} />
      {!error && !loading && (
        <>
          <Card className="divide-y-[1px] dark:divide-gray-700/80">
            {data?.search?.items?.map((post: LensterPublication, index: number) => (
              <SinglePublication key={`${post?.id}_${index}`} publication={post} />
            ))}
          </Card>
          {pageInfo?.next && data?.search?.items?.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-5">
              <Spinner size="sm" />
            </span>
          )}
        </>
      )}
    </>
  );
};

export default Publications;
