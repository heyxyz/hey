import { NetworkStatus, useQuery } from '@apollo/client';
import { EXPLORE_FEED_QUERY } from '@components/Explore/Feed';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Spinner } from '@components/UI/Spinner';
import { LensterPublication } from '@generated/lenstertypes';
import { PublicationSortCriteria } from '@generated/types';
import { CollectionIcon, RefreshIcon } from '@heroicons/react/outline';
import { Mixpanel } from '@lib/mixpanel';
import clsx from 'clsx';
import React, { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { useAppStore } from 'src/store/app';
import { PAGINATION } from 'src/tracking';

const Feed: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Variables
  const request = {
    sortCriteria: PublicationSortCriteria.Latest,
    noRandomize: true,
    limit: 10
  };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;

  const { data, loading, error, fetchMore, refetch, networkStatus } = useQuery(EXPLORE_FEED_QUERY, {
    variables: { request, reactionRequest, profileId },
    notifyOnNetworkStatusChange: true
  });

  const pageInfo = data?.explorePublications?.pageInfo;
  const { observe } = useInView({
    onEnter: () => {
      fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
      });
      Mixpanel.track(PAGINATION.MOD_FEED);
    }
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="font-bold text-lg">All Publications</div>
        <button onClick={() => refetch()}>
          <RefreshIcon
            className={clsx({ 'animate-spin': networkStatus === NetworkStatus.refetch }, 'h-5 w-5')}
          />
        </button>
      </div>
      {loading && <PublicationsShimmer />}
      {data?.explorePublications?.items?.length === 0 && (
        <EmptyState
          message={<div>No posts yet!</div>}
          icon={<CollectionIcon className="w-8 h-8 text-brand" />}
        />
      )}
      <ErrorMessage title="Failed to load explore feed" error={error} />
      {!error && !loading && data?.explorePublications?.items?.length !== 0 && (
        <>
          <Card className="divide-y-[1px] dark:divide-gray-700/80">
            {data?.explorePublications?.items?.map((post: LensterPublication, index: number) => (
              <SinglePublication
                key={`${post?.id}_${index}`}
                publication={post}
                showThread={false}
                showActions={false}
                showModActions
              />
            ))}
          </Card>
          {pageInfo?.next && data?.explorePublications?.items.length !== pageInfo?.totalCount && (
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
