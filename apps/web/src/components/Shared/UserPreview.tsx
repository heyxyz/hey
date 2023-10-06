import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import { FollowUnfollowSource } from '@hey/data/tracking';
import type { Profile } from '@hey/lens';
import { useProfileLazyQuery } from '@hey/lens';
import formatHandle from '@hey/lib/formatHandle';
import getAvatar from '@hey/lib/getAvatar';
import hasMisused from '@hey/lib/hasMisused';
import nFormatter from '@hey/lib/nFormatter';
import sanitizeDisplayName from '@hey/lib/sanitizeDisplayName';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import truncateByWords from '@hey/lib/truncateByWords';
import { Image } from '@hey/ui';
import cn from '@hey/ui/cn';
import isVerified from '@lib/isVerified';
import { Plural, Trans } from '@lingui/macro';
import Tippy from '@tippyjs/react';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';

import Markup from './Markup';
import Follow from './Profile/Follow';
import Slug from './Slug';
import SuperFollow from './SuperFollow';

const MINIMUM_LOADING_ANIMATION_MS = 500;
const POPOVER_SHOW_ANIMATION_MS = 100;
const POPOVER_HIDE_ANIMATION_MS = 0;

interface UserPreviewProps {
  children: ReactNode;
  handle?: string;
  profile?: Profile;
  isBig?: boolean;
  followStatusLoading?: boolean;
  showUserPreview?: boolean;
}

const UserPreview: FC<UserPreviewProps> = ({
  children,
  handle,
  profile,
  isBig,
  followStatusLoading,
  showUserPreview = true
}) => {
  const [lazyProfile, setLazyProfile] = useState<Profile | undefined>();
  const [loadProfile, { loading: networkLoading, data }] = useProfileLazyQuery({
    fetchPolicy: 'cache-first'
  });

  const compositeHandle = handle ?? profile?.handle;
  const [syntheticLoading, setSyntheticLoading] =
    useState<boolean>(networkLoading);

  const onPreviewStart = () => {
    if (!lazyProfile) {
      setSyntheticLoading(true);
      loadProfile({
        variables: {
          request: { handle: formatHandle(compositeHandle, true) }
        }
      });
      setTimeout(() => {
        setSyntheticLoading(false);
      }, MINIMUM_LOADING_ANIMATION_MS);
    }
  };

  if (data && !lazyProfile) {
    setLazyProfile(data?.profile as Profile);
  }

  const compositeProfile = lazyProfile ?? profile;
  const [following, setFollowing] = useState(compositeProfile?.isFollowedByMe);

  if (!handle && !profile) {
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
            <div>{compositeHandle}</div>
          </div>
        </div>
      );
    }

    if (!compositeProfile) {
      return (
        <div className="flex h-12 items-center px-3">
          <Trans>No profile found</Trans>
        </div>
      );
    }

    const UserAvatar = () => (
      <Image
        src={getAvatar(compositeProfile)}
        loading="lazy"
        className={cn(
          isBig ? 'h-14 w-14' : 'h-10 w-10',
          'rounded-full border bg-gray-200 dark:border-gray-700'
        )}
        height={isBig ? 56 : 40}
        width={isBig ? 56 : 40}
        alt={formatHandle(compositeProfile.handle)}
      />
    );

    const UserName = () => (
      <>
        <div className="flex max-w-sm items-center gap-1 truncate">
          <div className={cn(isBig ? 'font-bold' : 'text-md')}>
            {sanitizeDisplayName(compositeProfile.name) ??
              formatHandle(compositeProfile.handle)}
          </div>
          {isVerified(compositeProfile.id) ? (
            <CheckBadgeIcon className="text-brand h-4 w-4" />
          ) : null}
          {hasMisused(compositeProfile.id) ? (
            <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
          ) : null}
        </div>
        <Slug
          className="text-sm"
          slug={formatHandle(compositeProfile.handle)}
          prefix="@"
        />
      </>
    );

    return (
      <>
        <div className="flex items-center justify-between px-3.5 pb-1 pt-4">
          <UserAvatar />
          <div onClick={stopEventPropagation} aria-hidden="false">
            {!compositeProfile.isFollowedByMe ? (
              followStatusLoading ? (
                <div className="shimmer h-8 w-10 rounded-lg" />
              ) : following ? null : compositeProfile.followModule
                  ?.__typename === 'FeeFollowModuleSettings' ? (
                <SuperFollow
                  profile={compositeProfile}
                  setFollowing={setFollowing}
                  followUnfollowSource={FollowUnfollowSource.PROFILE_POPOVER}
                />
              ) : (
                <Follow
                  profile={compositeProfile}
                  setFollowing={setFollowing}
                  followUnfollowSource={FollowUnfollowSource.PROFILE_POPOVER}
                />
              )
            ) : null}
          </div>
        </div>
        <div className="space-y-3 p-4 pt-0">
          <UserName />
          <div>
            {compositeProfile.bio ? (
              <div
                className={cn(
                  isBig ? 'text-base' : 'text-sm',
                  'mt-2',
                  'linkify break-words leading-6'
                )}
              >
                <Markup>{truncateByWords(compositeProfile.bio, 20)}</Markup>
              </div>
            ) : null}
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <div className="text-base">
                {nFormatter(compositeProfile.stats.totalFollowing)}
              </div>
              <div className="lt-text-gray-500 text-sm">
                <Plural
                  value={compositeProfile.stats.totalFollowing}
                  zero="Following"
                  one="Following"
                  other="Following"
                />
              </div>
            </div>
            <div className="text-md flex items-center space-x-1">
              <div className="text-base">
                {nFormatter(compositeProfile.stats.totalFollowers)}
              </div>
              <div className="lt-text-gray-500 text-sm">
                <Plural
                  value={compositeProfile.stats.totalFollowers}
                  zero="Follower"
                  one="Follower"
                  other="Followers"
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <span onMouseOver={onPreviewStart} onFocus={onPreviewStart}>
      <Tippy
        placement="bottom-start"
        delay={[POPOVER_SHOW_ANIMATION_MS, POPOVER_HIDE_ANIMATION_MS]}
        hideOnClick={false}
        content={<Preview />}
        arrow={false}
        interactive
        zIndex={1000}
        className="preview-tippy-content hidden w-64 !rounded-xl border !bg-white !text-black dark:border-gray-700 dark:!bg-black dark:!text-white md:block"
        appendTo={() => document.body}
      >
        <span>{children}</span>
      </Tippy>
    </span>
  );
};

export default UserPreview;
