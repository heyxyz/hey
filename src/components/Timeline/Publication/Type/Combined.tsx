import type { FeedItem } from '@generated/types';
import { ChatAlt2Icon, CollectionIcon, HeartIcon, SwitchHorizontalIcon } from '@heroicons/react/outline';
import type { FC } from 'react';

import ProfileCircles from './ProfileCircles';

interface Props {
  feedItem: FeedItem;
}

const Combined: FC<Props> = ({ feedItem }) => {
  const totalComments = feedItem.comments?.length ?? 0;
  const total =
    feedItem.mirrors.length + feedItem.collects.length + feedItem.reactions.length + totalComments;
  // const profile =
  //   (feedItem.comments && feedItem.comments[0]?.profile) ??
  //   feedItem.mirrors[0]?.profile ??
  //   feedItem.collects[0]?.profile ??
  //   feedItem.reactions[0]?.profile;

  const getAllProfiles = () => {
    const mirrors = feedItem.mirrors;
    const collects = feedItem.collects;
    const reactions = feedItem.reactions;
    const comments = feedItem.comments ?? [];
    let profiles = [...mirrors, ...collects, ...reactions, ...comments].map((event) => event.profile);
    profiles = profiles.filter(
      (profile, index, self) => index === self.findIndex((t) => t.id === profile.id)
    );
    return profiles;
  };

  return (
    <div className="flex items-center pb-4 space-x-1 text-gray-500 text-[13px]">
      <div className="flex items-center space-x-1">
        {feedItem.mirrors.length ? <SwitchHorizontalIcon className="w-4 h-4" /> : null}
        {feedItem.comments?.length ? <ChatAlt2Icon className="w-4 h-4" /> : null}
        {feedItem.collects?.length ? <CollectionIcon className="w-4 h-4" /> : null}
        {feedItem.reactions?.length ? <HeartIcon className="w-4 h-4" /> : null}
      </div>
      <ProfileCircles profiles={getAllProfiles()} totalCount={getAllProfiles().length} />
      {/* <Link href={`/u/${profile?.handle}`} className="max-w-xs truncate">
        {profile?.name ? <b>{profile?.name}</b> : <Slug slug={profile?.handle} prefix="@" />}
      </Link>
      <span>and {total - 1} others</span> */}
    </div>
  );
};

export default Combined;
