import type { FeedItem } from '@generated/types';
import { ChatAlt2Icon, CollectionIcon, HeartIcon, SwitchHorizontalIcon } from '@heroicons/react/outline';
import type { FC } from 'react';

import ProfileCircles from './ProfileCircles';

interface Props {
  feedItem: FeedItem;
}

const Combined: FC<Props> = ({ feedItem }) => {
  const mirrors = feedItem.mirrors;
  const collects = feedItem.collects;
  const reactions = feedItem.reactions;
  const comments = feedItem.comments ?? [];

  const mirrorsLength = mirrors.length;
  const collectsLength = collects.length;
  const reactionsLength = reactions.length;
  const commentsLength = comments?.length ?? 0;

  const getReactionsLength = () => {
    return [mirrorsLength, collectsLength, reactionsLength, commentsLength ?? 0].filter((n) => n > 0).length;
  };

  const totalActions = getReactionsLength();

  const getAllProfiles = () => {
    let profiles = [...mirrors, ...collects, ...reactions, ...comments].map((event) => event.profile);
    profiles = profiles.filter(
      (profile, index, self) => index === self.findIndex((t) => t.id === profile.id)
    );
    return profiles;
  };

  return (
    <div className="flex flex-wrap items-center pb-4 space-x-1 text-gray-500 text-[13px]">
      <div className="flex items-center space-x-1">
        {mirrorsLength ? (
          <span className="flex whitespace-nowrap items-center">
            <SwitchHorizontalIcon className="w-3.5 h-3.5 mr-1" />
            Mirrored{totalActions < 3 ? (totalActions !== 1 ? ' and ' : '') : ', '}
          </span>
        ) : null}
        {commentsLength ? (
          <span className="flex whitespace-nowrap items-center">
            <ChatAlt2Icon className="w-3.5 h-3.5 mr-1" />
            Commented
            {totalActions < 3
              ? collectsLength && reactionsLength
                ? ' and '
                : !mirrorsLength && totalActions !== 1
                ? ' and '
                : ''
              : ', '}
            {totalActions >= 3 && (!collectsLength || !reactionsLength) ? ' and ' : ''}
          </span>
        ) : null}
        {collectsLength ? (
          <span className="flex whitespace-nowrap items-center">
            <CollectionIcon className="w-3.5 h-3.5 mr-1" />
            Collected
            {totalActions >= 3 && reactionsLength ? ' and ' : reactionsLength ? ' and ' : ''}
          </span>
        ) : null}
        {reactionsLength ? (
          <span className="flex whitespace-nowrap items-center">
            <HeartIcon className="w-3.5 h-3.5 mr-1" />
            Reacted
          </span>
        ) : null}
      </div>
      <ProfileCircles profiles={getAllProfiles()} context="by" />
    </div>
  );
};

export default Combined;
