import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/24/outline';
import { FollowUnfollowSource } from '@hey/data/tracking';
import type { MutualFollowersRequest, Profile } from '@hey/lens';
import { LimitType, useMutualFollowersQuery } from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import { type FC } from 'react';
import { Virtuoso } from 'react-virtuoso';
import useProfilePersistStore from 'src/store/useProfilePersistStore';

interface MutualFollowersListProps {
  profile: Profile;
}

const MutualFollowersList: FC<MutualFollowersListProps> = ({ profile }) => {
  const currentProfile = useProfilePersistStore(
    (state) => state.currentProfile
  );

  // Variables
  const request: MutualFollowersRequest = {
    viewing: profile.id,
    observer: currentProfile?.id,
    limit: LimitType.TwentyFive
  };

  const { data, loading, error, fetchMore } = useMutualFollowersQuery({
    variables: { request },
    skip: !profile.id
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
        message={
          <div>
            <span className="mr-1 font-bold">
              {getProfile(profile).slugWithPrefix}
            </span>
            <span>doesn’t have any mutual followers.</span>
          </div>
        }
        icon={<UsersIcon className="text-brand-500 h-8 w-8" />}
        hideCard
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <ErrorMessage
        title="Failed to load mutual followers"
        error={error}
        className="m-5"
      />
      <Virtuoso
        className="virtual-profile-list"
        data={mutualFollowers}
        endReached={onEndReached}
        itemContent={(index, mutualFollower) => {
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-5"
            >
              <UserProfile
                profile={mutualFollower as Profile}
                isFollowing={mutualFollower.operations.isFollowedByMe.value}
                followUnfollowPosition={index + 1}
                followUnfollowSource={FollowUnfollowSource.FOLLOWERS_MODAL}
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
