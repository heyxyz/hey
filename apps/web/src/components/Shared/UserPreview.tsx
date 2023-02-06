import { BadgeCheckIcon } from '@heroicons/react/solid';
import formatHandle from '@lib/formatHandle';
import getAvatar from '@lib/getAvatar';
import isVerified from '@lib/isVerified';
import nFormatter from '@lib/nFormatter';
import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import type { Profile } from 'lens';
import { useProfileLazyQuery } from 'lens';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';

import Follow, { FollowSource } from './Follow';
import Markup from './Markup';
import Slug from './Slug';
import SuperFollow from './SuperFollow';

interface Props {
  profile: Profile;
  children: ReactNode;
  isBig?: boolean;
  followStatusLoading?: boolean;
  showUserPreview?: boolean;
}

const UserPreview: FC<Props> = ({
  profile,
  isBig,
  followStatusLoading,
  children,
  showUserPreview = true
}) => {
  const [lazyProfile, setLazyProfile] = useState(profile);
  const [following, setFollowing] = useState(profile?.isFollowedByMe);

  const [loadProfile] = useProfileLazyQuery({
    fetchPolicy: 'cache-first'
  });

  const UserAvatar = () => (
    <img
      onError={({ currentTarget }) => {
        currentTarget.src = getAvatar(lazyProfile, false);
      }}
      src={getAvatar(lazyProfile)}
      loading="lazy"
      className={clsx(
        isBig ? 'h-14 w-14' : 'h-10 w-10',
        'rounded-full border bg-gray-200 dark:border-gray-700'
      )}
      height={isBig ? 56 : 40}
      width={isBig ? 56 : 40}
      alt={formatHandle(lazyProfile?.handle)}
    />
  );

  const UserName = () => (
    <>
      <div className="flex max-w-sm items-center gap-1 truncate">
        <div className={clsx(isBig ? 'font-bold' : 'text-md')}>
          {lazyProfile?.name ?? formatHandle(lazyProfile?.handle)}
        </div>
        {isVerified(lazyProfile?.id) && <BadgeCheckIcon className="text-brand h-4 w-4" />}
      </div>
      <Slug className="text-sm" slug={formatHandle(lazyProfile?.handle)} prefix="@" />
    </>
  );

  const Preview = () => (
    <>
      <div className="flex items-center justify-between">
        <UserAvatar />
        <div onClick={(e) => e.preventDefault()}>
          {!lazyProfile.isFollowedByMe &&
            (followStatusLoading ? (
              <div className="shimmer h-8 w-10 rounded-lg" />
            ) : following ? null : lazyProfile?.followModule?.__typename === 'FeeFollowModuleSettings' ? (
              <SuperFollow profile={lazyProfile} setFollowing={setFollowing} />
            ) : (
              <Follow
                profile={lazyProfile}
                setFollowing={setFollowing}
                followSource={FollowSource.PROFILE_POPOVER}
              />
            ))}
        </div>
      </div>
      <div className="space-y-3 p-1">
        <UserName />
        <div>
          {lazyProfile?.bio && (
            <div className={clsx(isBig ? 'text-base' : 'text-sm', 'mt-2', 'linkify break-words leading-6')}>
              <Markup>{lazyProfile?.bio}</Markup>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <div className="text-base">{nFormatter(lazyProfile?.stats?.totalFollowing)}</div>
            <div className="lt-text-gray-500 text-sm">Following</div>
          </div>
          <div className="text-md flex items-center space-x-1">
            <div className="text-base">{nFormatter(lazyProfile?.stats?.totalFollowers)}</div>
            <div className="lt-text-gray-500 text-sm">Followers</div>
          </div>
        </div>
      </div>
    </>
  );

  const onPreviewStart = async () => {
    if (!lazyProfile.id) {
      const { data } = await loadProfile({
        variables: { request: { handle: formatHandle(lazyProfile?.handle, true) } }
      });
      const getProfile = data?.profile;
      if (getProfile) {
        setLazyProfile(getProfile as Profile);
      }
    }
  };

  return showUserPreview ? (
    <span onMouseOver={onPreviewStart}>
      {lazyProfile?.id ? (
        <Tippy
          placement="bottom-start"
          delay={[800, 0]}
          hideOnClick={false}
          content={<Preview />}
          arrow={false}
          interactive
          zIndex={1000}
          className="hidden w-64 !rounded-xl border !bg-white !px-1.5 !py-3 !text-black dark:border-gray-700 dark:!bg-black dark:!text-white md:block"
          appendTo={() => document.body}
        >
          <span>{children}</span>
        </Tippy>
      ) : (
        <span>{children}</span>
      )}
    </span>
  ) : (
    <span>{children}</span>
  );
};

export default UserPreview;
