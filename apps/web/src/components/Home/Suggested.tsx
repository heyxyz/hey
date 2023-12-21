import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import DismissRecommendedProfile from '@components/Shared/DismissRecommendedProfile';
import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/24/outline';
import { useProfileRecommendationsQuery } from '@hey/lens';
import { EmptyState, ErrorMessage } from '@hey/ui';
import { motion } from 'framer-motion';
import { Virtuoso } from 'react-virtuoso';
import useProfileStore from 'src/store/persisted/useProfileStore';

const Suggested: FC = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const { data, error, loading } = useProfileRecommendationsQuery({
    variables: { request: { for: currentProfile?.id } }
  });

  if (loading) {
    return <Loader message="Loading suggested" />;
  }

  if (data?.profileRecommendations.items.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<UsersIcon className="text-brand-500 size-8" />}
        message="Nothing to suggest"
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <ErrorMessage error={error} title="Failed to load recommendations" />
      <Virtuoso
        className="virtual-profile-list"
        data={data?.profileRecommendations.items}
        itemContent={(_, profile) => {
          return (
            <motion.div
              animate={{ opacity: 1 }}
              className="flex items-center space-x-3 p-5"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            >
              <div className="w-full">
                <UserProfile
                  profile={profile as Profile}
                  showBio
                  showFollow
                  showUserPreview={false}
                />
              </div>
              <DismissRecommendedProfile profile={profile as Profile} />
            </motion.div>
          );
        }}
      />
    </div>
  );
};

export default Suggested;
