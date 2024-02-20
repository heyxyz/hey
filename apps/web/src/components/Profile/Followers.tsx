import type { FollowersRequest, Profile } from '@hey/lens';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/24/outline';
import { ProfileLinkSource } from '@hey/data/tracking';
import { LimitType, useFollowersQuery } from '@hey/lens';
import { EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import { Virtuoso } from 'react-virtuoso';
import useProfileStore from 'src/store/persisted/useProfileStore';

interface FollowersProps {
  handle: string;
  profileId: string;
}

const Followers: FC<FollowersProps> = ({ handle, profileId }) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  // Variables
  const request: FollowersRequest = {
    limit: LimitType.TwentyFive,
    of: profileId
  };

  const { data, error, fetchMore, loading } = useFollowersQuery({
    skip: !profileId,
    variables: { request }
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
        hideCard
        icon={<UsersIcon className="text-brand-500 size-8" />}
        message={
          <div>
            <span className="mr-1 font-bold">{handle}</span>
            <span>doesn’t have any followers yet.</span>
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
        title="Failed to load followers"
      />
      <Virtuoso
        className="virtual-profile-list"
        data={followers}
        endReached={onEndReached}
        itemContent={(_, follower) => {
          return (
            <motion.div
              animate={{ opacity: 1 }}
              className="p-5"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            >
              <UserProfile
                profile={follower as Profile}
                showBio
                showFollow={currentProfile?.id !== follower.id}
                showUnfollow={currentProfile?.id !== follower.id}
                showUserPreview={false}
                source={ProfileLinkSource.Followers}
              />
            </motion.div>
          );
        }}
      />
    </div>
  );
};

export default Followers;
