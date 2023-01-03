import UserProfilesShimmer from '@components/Shared/Shimmer/UserProfilesShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import InfiniteLoader from '@components/UI/InfiniteLoader';
import { UsersIcon } from '@heroicons/react/outline';
import { t, Trans } from '@lingui/macro';
import { SCROLL_THRESHOLD } from 'data/constants';
import type { Profile, ProfileSearchResult } from 'lens';
import { CustomFiltersTypes, SearchRequestTypes, useSearchProfilesQuery } from 'lens';
import type { FC } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Props {
  query: string | string[];
}

const Profiles: FC<Props> = ({ query }) => {
  // Variables
  const request = {
    query,
    type: SearchRequestTypes.Profile,
    customFilters: [CustomFiltersTypes.Gardeners],
    limit: 10
  };

  const { data, loading, error, fetchMore } = useSearchProfilesQuery({
    variables: { request },
    skip: !query
  });

  const search = data?.search as ProfileSearchResult;
  const profiles = search?.items;
  const pageInfo = search?.pageInfo;
  const hasMore = pageInfo?.next && profiles?.length !== pageInfo.totalCount;

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return <UserProfilesShimmer isBig />;
  }

  if (profiles?.length === 0) {
    return (
      <EmptyState
        message={
          <Trans>
            No profiles for <b>&ldquo;{query}&rdquo;</b>
          </Trans>
        }
        icon={<UsersIcon className="w-8 h-8 text-brand" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title={t`Failed to load profiles`} error={error} />;
  }

  return (
    <InfiniteScroll
      dataLength={profiles?.length}
      scrollThreshold={SCROLL_THRESHOLD}
      hasMore={hasMore}
      next={loadMore}
      loader={<InfiniteLoader />}
    >
      <div className="space-y-3">
        {profiles?.map((profile: Profile) => (
          <Card key={profile?.id} className="p-5">
            <UserProfile profile={profile} showBio isBig />
          </Card>
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default Profiles;
