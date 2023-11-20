import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/24/outline';
import { FollowUnfollowSource } from '@hey/data/tracking';
import type { FollowingRequest, Profile } from '@hey/lens';
import { LimitType, useFollowingQuery } from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import { type FC } from 'react';
import { Virtuoso } from 'react-virtuoso';
import useProfilePersistStore from 'src/store/useProfilePersistStore';

interface FollowingProps {
  profile: Profile;
  onProfileSelected?: (profile: Profile) => void;
}

const Following: FC<FollowingProps> = ({ profile, onProfileSelected }) => {
  // Variables
  const request: FollowingRequest = {
    for: profile.id,
    limit: LimitType.TwentyFive
  };
  const currentProfile = useProfilePersistStore(
    (state) => state.currentProfile
  );

  const { data, loading, error, fetchMore } = useFollowingQuery({
    variables: { request },
    skip: !profile?.id
  });

  const followings = data?.following?.items;
  const pageInfo = data?.following?.pageInfo;
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
    return <Loader message="Loading following" />;
  }

  if (followings?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">
              {getProfile(profile).slugWithPrefix}
            </span>
            <span>doesn’t follow anyone.</span>
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
        title="Failed to load following"
        error={error}
        className="m-5"
      />
      <Virtuoso
        className="virtual-profile-list"
        data={followings}
        endReached={onEndReached}
        itemContent={(index, following) => {
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`p-5 ${
                onProfileSelected &&
                'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900'
              }`}
              onClick={
                onProfileSelected && following
                  ? () => {
                      onProfileSelected(following as Profile);
                    }
                  : undefined
              }
            >
              <UserProfile
                profile={following as Profile}
                linkToProfile={!onProfileSelected}
                isFollowing={following.operations.isFollowedByMe.value}
                followUnfollowPosition={index + 1}
                followUnfollowSource={FollowUnfollowSource.FOLLOWING_MODAL}
                showBio
                showFollow={currentProfile?.id !== following.id}
                showUnfollow={currentProfile?.id !== following.id}
                showUserPreview={false}
              />
            </motion.div>
          );
        }}
      />
    </div>
  );
};

export default Following;
