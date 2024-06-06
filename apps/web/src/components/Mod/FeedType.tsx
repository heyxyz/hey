import type { Dispatch, FC, SetStateAction } from 'react';

import { ModFeedType } from '@good/data/enums';
import { TabButton } from '@good/ui';

interface FeedTypeProps {
  feedType: ModFeedType;
  setFeedType: Dispatch<SetStateAction<ModFeedType>>;
}

const FeedType: FC<FeedTypeProps> = ({ feedType, setFeedType }) => {
  return (
    <div className="flex gap-3 overflow-x-auto px-5 sm:px-0">
      <TabButton
        active={feedType === ModFeedType.LATEST}
        name="Latest Publications"
        onClick={() => setFeedType(ModFeedType.LATEST)}
      />
      <TabButton
        active={feedType === ModFeedType.REPORTS}
        name="Latest Reports"
        onClick={() => setFeedType(ModFeedType.REPORTS)}
      />
      <TabButton
        active={feedType === ModFeedType.SEARCH}
        name="Search Publications"
        onClick={() => setFeedType(ModFeedType.SEARCH)}
      />
      <TabButton
        active={feedType === ModFeedType.PROFILES}
        name="Search Profiles"
        onClick={() => setFeedType(ModFeedType.PROFILES)}
      />
    </div>
  );
};

export default FeedType;
