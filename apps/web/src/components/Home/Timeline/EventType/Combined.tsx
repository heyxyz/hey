import type { FeedItem } from 'lens';
import type { FC } from 'react';

import ProfileCircles from './ProfileCircles';

interface Props {
  feedItem: FeedItem;
}

const Combined: FC<Props> = ({ feedItem }) => {
  const { mirrors, collects, reactions } = feedItem;
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
    <div className="flex flex-wrap leading-6 items-center pb-4 space-x-1 text-gray-500 text-[13px]">
      <ProfileCircles profiles={getAllProfiles()} />
      <div className="flex items-center space-x-1">
        {mirrorsLength ? (
          <span className="whitespace-nowrap">
            mirrored{totalActions < 3 ? (totalActions !== 1 ? ' and ' : '') : ', '}
          </span>
        ) : null}
        {commentsLength ? (
          <span className="whitespace-nowrap">
            commented
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
          <span className="whitespace-nowrap">
            collected
            {totalActions >= 3 && reactionsLength ? ' and ' : reactionsLength ? ' and ' : ''}
          </span>
        ) : null}
        {reactionsLength ? <span className="whitespace-nowrap">liked</span> : null}
      </div>
    </div>
  );
};

export default Combined;
