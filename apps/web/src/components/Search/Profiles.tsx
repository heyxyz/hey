import UserProfilesShimmer from '@components/Shared/Shimmer/UserProfilesShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/outline';
import { t, Trans } from '@lingui/macro';
import type { Profile, ProfileSearchResult, SearchQueryRequest } from 'lens';
import { CustomFiltersTypes, SearchRequestTypes, useSearchProfilesQuery } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';
import { Card, EmptyState, ErrorMessage } from 'ui';

interface ProfilesProps {
  query: string | string[];
}

const Profiles: FC<ProfilesProps> = ({ query }) => {
  const [hasMore, setHasMore] = useState(true);

  // Variables
  const request: SearchQueryRequest = {
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

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      }).then(({ data }) => {
        const search = data?.search as ProfileSearchResult;
        setHasMore(search?.items?.length > 0);
      });
    }
  });

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
        icon={<UsersIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title={t`Failed to load profiles`} error={error} />;
  }

  return (
    <div className="space-y-3">
      {profiles?.map((profile: Profile) => (
        <Card key={profile?.id} className="p-5">
          <UserProfile profile={profile} showBio isBig />
        </Card>
      ))}
      {hasMore && <span ref={observe} />}
    </div>
  );
};

export default Profiles;
