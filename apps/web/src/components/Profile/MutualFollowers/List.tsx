import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { FollowUnfollowSource } from '@lenster/data/tracking';
import type {
  MutualFollowersProfilesQueryRequest,
  Profile
} from '@lenster/lens';
import { useMutualFollowersQuery } from '@lenster/lens';
import { ErrorMessage } from '@lenster/ui';
import { t } from '@lingui/macro';
import { motion } from 'framer-motion';
import type { FC } from 'react';
import { useInView } from 'react-cool-inview';
import { useAppStore } from 'src/store/app';

interface MutualFollowersListProps {
  profileId: string;
}

const MutualFollowersList: FC<MutualFollowersListProps> = ({ profileId }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  // Variables
  const request: MutualFollowersProfilesQueryRequest = {
    viewingProfileId: profileId,
    yourProfileId: currentProfile?.id,
    limit: 10
  };

  const { data, loading, error, fetchMore } = useMutualFollowersQuery({
    variables: { request },
    skip: !profileId
  });

  const profiles = data?.mutualFollowersProfiles?.items;
  const pageInfo = data?.mutualFollowersProfiles?.pageInfo;
  const hasMore = pageInfo?.next;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  });

  if (loading) {
    return <Loader message={t`Loading mutual followers`} />;
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <ErrorMessage
        className="m-5"
        title={t`Failed to load mutual followers`}
        error={error}
      />

      <div className="divide-y dark:divide-gray-700">
        {profiles?.map((profile, index) => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-5"
            key={profile?.id}
          >
            <UserProfile
              profile={profile as Profile}
              isFollowing={profile?.isFollowedByMe}
              followUnfollowPosition={index + 1}
              followUnfollowSource={FollowUnfollowSource.MUTUAL_FOLLOWERS_MODAL}
              showBio
              showFollow
              showUserPreview={false}
            />
          </motion.div>
        ))}
      </div>
      {hasMore && <span ref={observe} />}
    </div>
  );
};

export default MutualFollowersList;
