import type { Profile, ProfileSearchRequest } from '@hey/lens';

import UserProfilesShimmer from '@components/Shared/Shimmer/UserProfilesShimmer';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/24/outline';
import {
  CustomFiltersType,
  LimitType,
  useSearchProfilesQuery
} from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import { type FC, memo } from 'react';
import { Virtuoso } from 'react-virtuoso';

interface ProfilesProps {
  query: string;
}

const Profiles: FC<ProfilesProps> = ({ query }) => {
  // Variables
  const request: ProfileSearchRequest = {
    limit: LimitType.TwentyFive,
    query,
    where: { customFilters: [CustomFiltersType.Gardeners] }
  };

  const { data, error, fetchMore, loading } = useSearchProfilesQuery({
    skip: !query,
    variables: { request }
  });

  const search = data?.searchProfiles;
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
        icon={<UsersIcon className="text-brand-500 h-8 w-8" />}
        message={
          <span>
            No profiles for <b>&ldquo;{query}&rdquo;</b>
          </span>
        }
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load profiles" />;
  }

  // eslint-disable-next-line react/display-name
  const MemoizedProfileItem = memo(
    (props: { profile: Profile | undefined }) => {
      return (
        <motion.div
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          <Card className="p-5" key={props.profile?.id}>
            <UserProfile isBig profile={props.profile as Profile} showBio />
          </Card>
        </motion.div>
      );
    }
  );

  return (
    <Virtuoso
      className="[&>div>div]:space-y-3"
      data={profiles}
      endReached={onEndReached}
      itemContent={(_, profile) => (
        <MemoizedProfileItem profile={profile as Profile} />
      )}
      useWindowScroll
    />
  );
};

export default Profiles;
