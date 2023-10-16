import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/24/outline';
import { FollowUnfollowSource } from '@hey/data/tracking';
import type { FollowersRequest, Profile } from '@hey/lens';
import { LimitType, useFollowersQuery } from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { useAppStore } from 'src/store/app';

interface FollowersProps {
  profile: Profile;
}

const Followers: FC<FollowersProps> = ({ profile }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Variables
  const request: FollowersRequest = {
    of: profile?.id,
    limit: LimitType.Fifty
  };

  const { data, loading, error, fetchMore } = useFollowersQuery({
    variables: { request },
    skip: !profile?.id
  });

  const followers = data?.followers?.items;
  const pageInfo = data?.followers?.pageInfo;
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
    return <Loader message="Loading followers" />;
  }

  if (followers?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">
              {getProfile(profile).slugWithPrefix}
            </span>
            <span>doesn’t have any followers yet.</span>
          </div>
        }
        icon={<UsersIcon className="text-brand h-8 w-8" />}
        hideCard
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto" data-testid="followers-modal">
      <ErrorMessage
        className="m-5"
        title="Failed to load followers"
        error={error}
      />
      <Virtuoso
        className="virtual-profile-list"
        data={followers}
        endReached={onEndReached}
        itemContent={(index, follower) => {
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-5"
            >
              <UserProfile
                profile={follower as Profile}
                isFollowing={follower.operations.isFollowedByMe.value}
                followUnfollowPosition={index + 1}
                followUnfollowSource={FollowUnfollowSource.FOLLOWERS_MODAL}
                showBio
                showFollow={currentProfile?.id !== follower.id}
                showUnfollow={currentProfile?.id !== follower.id}
                showUserPreview={false}
              />
            </motion.div>
          );
        }}
      />
    </div>
  );
};

export default Followers;
