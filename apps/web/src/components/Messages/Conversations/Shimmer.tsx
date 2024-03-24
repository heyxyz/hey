import type { FC } from 'react';

import UserProfileShimmer from '@components/Shared/Shimmer/UserProfileShimmer';
import cn from '@hey/ui/cn';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';

import NewConversation from './NewConversation';

const ConversationsShimmer: FC = () => {
  const { staffMode } = useFeatureFlagsStore();

  return (
    <div>
      <NewConversation />
      <div className="divider" />
      <div
        className={cn(
          staffMode ? 'h-[86vh] max-h-[86vh]' : 'h-[88.5vh] max-h-[88.5vh]',
          'space-y-5 px-5 py-3'
        )}
      >
        <UserProfileShimmer />
        <UserProfileShimmer />
        <UserProfileShimmer />
        <UserProfileShimmer />
        <UserProfileShimmer />
        <UserProfileShimmer />
        <UserProfileShimmer />
        <UserProfileShimmer />
        <UserProfileShimmer />
        <UserProfileShimmer />
        <UserProfileShimmer />
        <UserProfileShimmer />
        <UserProfileShimmer />
        <UserProfileShimmer />
        <UserProfileShimmer />
      </div>
    </div>
  );
};

export default ConversationsShimmer;
