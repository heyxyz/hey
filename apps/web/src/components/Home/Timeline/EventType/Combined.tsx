import type { FeedItem } from '@hey/lens';
import type { FC } from 'react';

import Profiles from '@components/Shared/Profiles';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface CombinedProps {
  feedItem: FeedItem;
}

const Combined: FC<CombinedProps> = ({ feedItem }) => {
  const { acted, comments, mirrors, reactions } = feedItem;

  const mirrorsLength = mirrors.length;
  const actedLength = acted.length;
  const reactionsLength = reactions.length;
  const commentsLength = comments?.length || 0;

  const getAllProfiles = () => {
    let profiles = [...mirrors, ...acted, ...reactions, ...comments].map(
      (event) => event.by
    );
    profiles = profiles.filter(
      (profile, index, self) =>
        index === self.findIndex((t) => t.id === profile.id)
    );
    return profiles;
  };

  const actionArray = [];
  if (mirrorsLength) {
    actionArray.push('mirrored');
  }
  if (commentsLength) {
    actionArray.push('commented');
  }
  if (actedLength) {
    actionArray.push('acted');
  }
  if (reactionsLength) {
    actionArray.push('liked');
  }

  return (
    <div className="ld-text-gray-500 flex flex-wrap items-center space-x-1 pb-4 text-[13px] leading-6">
      <SparklesIcon className="size-4" />
      <Profiles profiles={getAllProfiles()} />
      <div className="flex items-center space-x-1">
        {actionArray.map((action, index) => (
          <>
            <span key={action}>{action}</span>
            {index < actionArray.length - 2 && <span>, </span>}
            {index === actionArray.length - 2 && <span>and</span>}
          </>
        ))}
      </div>
    </div>
  );
};

export default Combined;
