import type { FollowingRequest, Profile } from '@hey/lens';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/24/outline';
import { LimitType, useFollowingQuery } from '@hey/lens';
import getProfile from '@hey/lib/getProfile';
import { EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import { Virtuoso } from 'react-virtuoso';
import useProfileStore from 'src/store/persisted/useProfileStore';

interface FollowingProps {
  onProfileSelected?: (profile: Profile) => void;
  profile: Profile;
}

const Following: FC<FollowingProps> = ({ onProfileSelected, profile }) => {
  // Variables
  const request: FollowingRequest = {
    for: profile.id,
    limit: LimitType.TwentyFive
  };
  const currentProfile = useProfileStore((state) => state.currentProfile);

  const { data, error, fetchMore, loading } = useFollowingQuery({
    skip: !profile?.id,
    variables: { request }
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
        hideCard
        icon={<UsersIcon className="text-brand-500 size-8" />}
        message={
          <div>
            <span className="mr-1 font-bold">
              {getProfile(profile).slugWithPrefix}
            </span>
            <span>doesn’t follow anyone.</span>
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
        title="Failed to load following"
      />
      <Virtuoso
        className="virtual-profile-list"
        data={followings}
        endReached={onEndReached}
        itemContent={(_, following) => {
          return (
            <motion.div
              animate={{ opacity: 1 }}
              className={`p-5 ${
                onProfileSelected &&
                'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900'
              }`}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={
                onProfileSelected && following
                  ? () => {
                      onProfileSelected(following as Profile);
                    }
                  : undefined
              }
            >
              <UserProfile
                linkToProfile={!onProfileSelected}
                profile={following as Profile}
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
