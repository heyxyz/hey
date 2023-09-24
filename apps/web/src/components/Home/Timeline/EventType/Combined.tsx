import Profiles from '@components/Shared/Profiles';
import { SparklesIcon } from '@heroicons/react/24/outline';
import type { FeedItem } from '@hey/lens';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';

interface CombinedProps {
  feedItem: FeedItem;
}

const Combined: FC<CombinedProps> = ({ feedItem }) => {
  const { mirrors, collects, reactions } = feedItem;
  const comments = feedItem.comments ?? [];

  const mirrorsLength = mirrors.length;
  const collectsLength = collects.length;
  const reactionsLength = reactions.length;
  const commentsLength = comments?.length ?? 0;

  const getAllProfiles = () => {
    let profiles = [...mirrors, ...collects, ...reactions, ...comments].map(
      (event) => event.profile
    );
    profiles = profiles.filter(
      (profile, index, self) =>
        index === self.findIndex((t) => t.id === profile.id)
    );
    return profiles;
  };

  const actionArray = [];
  if (mirrorsLength) {
    actionArray.push(t`mirrored`);
  }
  if (commentsLength) {
    actionArray.push(t`commented`);
  }
  if (collectsLength) {
    actionArray.push(t`collected`);
  }
  if (reactionsLength) {
    actionArray.push(t`liked`);
  }

  return (
    <div className="lt-text-gray-500 flex flex-wrap items-center space-x-1 pb-4 text-[13px] leading-6">
      <SparklesIcon className="h-4 w-4" />
      <Profiles profiles={getAllProfiles()} />
      <div className="flex items-center space-x-1">
        {actionArray.map((action, index) => (
          <>
            <span key={index}>{action}</span>
            {index < actionArray.length - 2 && <span>, </span>}
            {index == actionArray.length - 2 && (
              <span>
                <Trans>and</Trans>
              </span>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default Combined;
