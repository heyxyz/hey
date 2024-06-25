import type { Dispatch, FC, SetStateAction } from 'react';

import { ModFeedType } from '@hey/data/enums';
import { TabButton } from '@hey/ui';

interface FeedTypeProps {
  feedType: ModFeedType;
  setFeedType: Dispatch<SetStateAction<ModFeedType>>;
}

const FeedType: FC<FeedTypeProps> = ({ feedType, setFeedType }) => {
  const tabs = [
    { name: 'Latest Publications', type: ModFeedType.LATEST },
    { name: 'Latest Reports', type: ModFeedType.REPORTS },
    { name: 'Search Publications', type: ModFeedType.SEARCH },
    { name: 'Search Profiles', type: ModFeedType.PROFILES }
  ];

  return (
    <div className="flex gap-3 overflow-x-auto px-5 sm:px-0">
      {tabs.map((tab) => (
        <TabButton
          active={feedType === tab.type}
          key={tab.type}
          name={tab.name}
          onClick={() => setFeedType(tab.type)}
        />
      ))}
    </div>
  );
};

export default FeedType;
