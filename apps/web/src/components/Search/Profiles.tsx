import UserProfilesShimmer from '@components/Shared/Shimmer/UserProfilesShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/outline';
import type { ProfileSearchResult, SearchQueryRequest } from '@lenster/lens';
import {
  CustomFiltersTypes,
  SearchRequestTypes,
  useSearchProfilesQuery
} from '@lenster/lens';
import { Card, EmptyState, ErrorMessage } from '@lenster/ui';
import { t, Trans } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { Virtuoso } from 'react-virtuoso';

interface ProfilesProps {
  query: string | string[];
}

const Profiles: FC<ProfilesProps> = ({ query }) => {
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
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

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
        icon={<UsersIcon className="text-brand h-8 w-8" />}
      />
    );
  }

  if (error) {
    return <ErrorMessage title={t`Failed to load profiles`} error={error} />;
  }

  return (
    <Virtuoso
      useWindowScroll
      className="[&>div>div]:space-y-3"
      data={profiles}
      endReached={onEndReached}
      itemContent={(_, profile) => {
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card key={profile?.id} className="p-5">
              <UserProfile profile={profile} showBio isBig />
            </Card>
          </motion.div>
        );
      }}
    />
  );
};

export default Profiles;
