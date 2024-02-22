import type { Dispatch, FC, SetStateAction } from 'react';

import {
  ClockIcon,
  MagnifyingGlassIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { ModFeedType } from '@hey/data/enums';
import { TabButton } from '@hey/ui';

interface FeedTypeProps {
  feedType: ModFeedType;
  setFeedType: Dispatch<SetStateAction<ModFeedType>>;
}

const FeedType: FC<FeedTypeProps> = ({ feedType, setFeedType }) => {
  return (
    <div className="flex gap-3 overflow-x-auto sm:px-0">
      <TabButton
        active={feedType === ModFeedType.LATEST}
        icon={<ClockIcon className="size-4" />}
        name="Latest"
        onClick={() => setFeedType(ModFeedType.LATEST)}
      />
      <TabButton
        active={feedType === ModFeedType.SEARCH}
        icon={<MagnifyingGlassIcon className="size-4" />}
        name="Search"
        onClick={() => setFeedType(ModFeedType.SEARCH)}
      />
      <TabButton
        active={feedType === ModFeedType.PROFILES}
        icon={<UsersIcon className="size-4" />}
        name="Profiles"
        onClick={() => setFeedType(ModFeedType.PROFILES)}
      />
    </div>
  );
};

export default FeedType;
