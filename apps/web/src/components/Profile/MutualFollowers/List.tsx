import type { MutualFollowersRequest, Profile } from '@hey/lens';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/24/outline';
import { LimitType, useMutualFollowersQuery } from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import { Virtuoso } from 'react-virtuoso';
import useProfileStore from 'src/store/persisted/useProfileStore';

interface MutualFollowersListProps {
  profile: Profile;
}

const MutualFollowersList: FC<MutualFollowersListProps> = ({ profile }) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  // Variables
  const request: MutualFollowersRequest = {
    limit: LimitType.TwentyFive,
    observer: currentProfile?.id,
    viewing: profile.id
  };

  const { data, error, fetchMore, loading } = useMutualFollowersQuery({
    skip: !profile.id,
    variables: { request }
  });

  const mutualFollowers = data?.mutualFollowers?.items;
  const pageInfo = data?.mutualFollowers?.pageInfo;
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
    return <Loader message="Loading mutual followers" />;
  }

  if (mutualFollowers?.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<UsersIcon className="text-brand-500 size-8" />}
        message={
          <div>
            <span className="mr-1 font-bold">
              {getProfile(profile).slugWithPrefix}
            </span>
            <span>doesn’t have any mutual followers.</span>
          </div>
        }
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load mutual followers"
      />
      <Virtuoso
        className="virtual-profile-list"
        data={mutualFollowers}
        endReached={onEndReached}
        itemContent={(_, mutualFollower) => {
          return (
            <motion.div
              animate={{ opacity: 1 }}
              className="p-5"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            >
              <UserProfile
                profile={mutualFollower as Profile}
                showBio
                showFollow={currentProfile?.id !== mutualFollower.id}
                showUnfollow={currentProfile?.id !== mutualFollower.id}
                showUserPreview={false}
              />
            </motion.div>
          );
        }}
      />
    </div>
  );
};

export default MutualFollowersList;
