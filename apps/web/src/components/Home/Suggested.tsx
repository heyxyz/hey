import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import DismissRecommendedProfile from '@components/Shared/DismissRecommendedProfile';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/24/outline';
import { ProfileLinkSource } from '@hey/data/tracking';
import { EmptyState } from '@hey/ui';
import { motion } from 'framer-motion';
import { Virtuoso } from 'react-virtuoso';

interface SuggestedProps {
  profiles: Profile[];
}

const Suggested: FC<SuggestedProps> = ({ profiles }) => {
  if (profiles.length === 0) {
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
      <Virtuoso
        className="virtual-profile-list"
        data={profiles}
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
                  source={ProfileLinkSource.WhoToFollow}
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
