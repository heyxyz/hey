import type { Profile } from '@hey/lens';
import type { FC, ReactNode } from 'react';

import MutualFollowers from '@components/Profile/MutualFollowers';
import isVerified from '@helpers/isVerified';
import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import getAvatar from '@hey/helpers/getAvatar';
import getLennyURL from '@hey/helpers/getLennyURL';
import getMentions from '@hey/helpers/getMentions';
import getProfile from '@hey/helpers/getProfile';
import hasMisused from '@hey/helpers/hasMisused';
import nFormatter from '@hey/helpers/nFormatter';
import truncateByWords from '@hey/helpers/truncateByWords';
import { useProfileLazyQuery } from '@hey/lens';
import { Card, Image } from '@hey/ui';
import * as HoverCard from '@radix-ui/react-hover-card';
import plur from 'plur';
import { useState } from 'react';

import Markup from './Markup';
import FollowUnfollowButton from './Profile/FollowUnfollowButton';
import Slug from './Slug';

const MINIMUM_LOADING_ANIMATION_MS = 800;

interface UserPreviewProps {
  children: ReactNode;
  handle?: string;
  id?: string;
  showUserPreview?: boolean;
}

const UserPreview: FC<UserPreviewProps> = ({
  children,
  handle,
  id,
  showUserPreview = true
}) => {
  const [loadProfile, { data, loading: networkLoading }] = useProfileLazyQuery({
    fetchPolicy: 'cache-and-network'
  });
  const [syntheticLoading, setSyntheticLoading] =
    useState<boolean>(networkLoading);
  const profile = data?.profile as Profile;

  const onPreviewStart = async () => {
    if (profile || networkLoading) {
      return;
    }

    setSyntheticLoading(true);
    await loadProfile({
      variables: {
        request: { ...(id ? { forProfileId: id } : { forHandle: handle }) }
      }
    });
    setTimeout(() => {
      setSyntheticLoading(false);
    }, MINIMUM_LOADING_ANIMATION_MS);
  };

  if (!id && !handle) {
    return null;
  }

  if (!showUserPreview) {
    return <span>{children}</span>;
  }

  const Preview = () => {
    if (networkLoading || syntheticLoading) {
      return (
        <div className="flex flex-col">
          <div className="horizontal-loader w-full">
            <div />
          </div>
          <div className="flex p-3">
            <div>{handle || `#${id}`}</div>
          </div>
        </div>
      );
    }

    if (!profile) {
      return (
        <div className="flex h-12 items-center px-3">No profile found</div>
      );
    }

    const UserAvatar = () => (
      <Image
        alt={profile.id}
        className="size-12 rounded-full border bg-gray-200 dark:border-gray-700"
        height={48}
        loading="lazy"
        onError={({ currentTarget }) => {
          currentTarget.src = getLennyURL(profile.id);
        }}
        src={getAvatar(profile)}
        width={48}
      />
    );

    const UserName = () => (
      <>
        <div className="flex max-w-sm items-center gap-1 truncate">
          <div className="text-md">{getProfile(profile).displayName}</div>
          {isVerified(profile.id) ? (
            <CheckBadgeIcon className="text-brand-500 size-4" />
          ) : null}
          {hasMisused(profile.id) ? (
            <ExclamationCircleIcon className="size-4 text-red-500" />
          ) : null}
        </div>
        <span>
          <Slug className="text-sm" slug={getProfile(profile).slugWithPrefix} />
          {profile.operations.isFollowingMe.value ? (
            <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs dark:bg-gray-700">
              Follows you
            </span>
          ) : null}
        </span>
      </>
    );

    return (
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <UserAvatar />
          <FollowUnfollowButton profile={profile} small />
        </div>
        <UserName />
        <div>
          {profile.metadata?.bio ? (
            <div className="linkify mt-2 break-words text-sm leading-6">
              <Markup mentions={getMentions(profile.metadata.bio)}>
                {truncateByWords(profile.metadata.bio, 20)}
              </Markup>
            </div>
          ) : null}
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <div className="text-base">
              {nFormatter(profile.stats.following)}
            </div>
            <div className="ld-text-gray-500 text-sm">Following</div>
          </div>
          <div className="text-md flex items-center space-x-1">
            <div className="text-base">
              {nFormatter(profile.stats.followers)}
            </div>
            <div className="ld-text-gray-500 text-sm">
              {plur('Follower', profile.stats.followers)}
            </div>
          </div>
        </div>
        <div className="!text-xs">
          <MutualFollowers
            handle={getProfile(profile).slug}
            profileId={profile.id}
            viaPopover
          />
        </div>
      </div>
    );
  };

  return (
    <span onFocus={onPreviewStart} onMouseOver={onPreviewStart}>
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <span>{children}</span>
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content
            asChild
            className="z-10 w-72"
            side="bottom"
            sideOffset={5}
          >
            <div>
              <Card forceRounded>
                <Preview />
              </Card>
            </div>
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </span>
  );
};

export default UserPreview;
