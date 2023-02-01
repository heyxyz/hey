import Message from '@components/Profile/Message';
import Follow, { FollowSource } from '@components/Shared/Follow';
import Markup from '@components/Shared/Markup';
import Slug from '@components/Shared/Slug';
import SuperFollow from '@components/Shared/SuperFollow';
import Unfollow from '@components/Shared/Unfollow';
import ProfileStaffTool from '@components/StaffTools/Panels/Profile';
import { Button } from '@components/UI/Button';
import { Modal } from '@components/UI/Modal';
import { Tooltip } from '@components/UI/Tooltip';
import useStaffMode from '@components/utils/hooks/useStaffMode';
import { CogIcon, HashtagIcon, LocationMarkerIcon, UsersIcon } from '@heroicons/react/outline';
import { BadgeCheckIcon } from '@heroicons/react/solid';
import buildConversationId from '@lib/buildConversationId';
import { buildConversationKey } from '@lib/conversationKey';
import formatAddress from '@lib/formatAddress';
import formatHandle from '@lib/formatHandle';
import getAttribute from '@lib/getAttribute';
import getAvatar from '@lib/getAvatar';
import isStaff from '@lib/isStaff';
import isVerified from '@lib/isVerified';
import { t, Trans } from '@lingui/macro';
import { RARIBLE_URL, STATIC_IMAGES_URL } from 'data/constants';
import getEnvConfig from 'data/utils/getEnvConfig';
import type { Profile } from 'lens';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import type { FC, ReactElement } from 'react';
import { useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useMessageStore } from 'src/store/message';

import Badges from './Badges';
import Followerings from './Followerings';
import MutualFollowers from './MutualFollowers';
import MutualFollowersList from './MutualFollowers/List';

interface Props {
  profile: Profile;
}

const Details: FC<Props> = ({ profile }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [following, setFollowing] = useState(profile?.isFollowedByMe);
  const [showMutualFollowersModal, setShowMutualFollowersModal] = useState(false);
  const { allowed: staffMode } = useStaffMode();
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const addProfileAndSelectTab = useMessageStore((state) => state.addProfileAndSelectTab);

  const onMessageClick = () => {
    if (!currentProfile) {
      return;
    }
    const conversationId = buildConversationId(currentProfile.id, profile.id);
    const conversationKey = buildConversationKey(profile.ownedBy, conversationId);
    addProfileAndSelectTab(conversationKey, profile);
    router.push(`/messages/${conversationKey}`);
  };

  const MetaDetails = ({ children, icon }: { children: ReactElement; icon: ReactElement }) => (
    <div className="flex items-center gap-2">
      {icon}
      <div className="text-md truncate">{children}</div>
    </div>
  );

  const followType = profile?.followModule?.__typename;

  return (
    <div className="mb-4 space-y-5 px-5 sm:px-0">
      <div className="relative -mt-24 h-32 w-32 sm:-mt-32 sm:h-52 sm:w-52">
        <img
          onError={({ currentTarget }) => {
            currentTarget.src = getAvatar(profile, false);
          }}
          src={getAvatar(profile)}
          className="h-32 w-32 rounded-xl bg-gray-200 ring-8 ring-gray-50 dark:bg-gray-700 dark:ring-black sm:h-52 sm:w-52"
          height={128}
          width={128}
          alt={formatHandle(profile?.handle)}
        />
      </div>
      <div className="space-y-1 py-2">
        <div className="flex items-center gap-1.5 text-2xl font-bold">
          <div className="truncate">{profile?.name ?? formatHandle(profile?.handle)}</div>
          {isVerified(profile?.id) && (
            <Tooltip content="Verified">
              <BadgeCheckIcon className="text-brand h-6 w-6" />
            </Tooltip>
          )}
        </div>
        <div className="flex items-center space-x-3">
          {profile?.name ? (
            <Slug className="text-sm sm:text-base" slug={formatHandle(profile?.handle)} prefix="@" />
          ) : (
            <Slug className="text-sm sm:text-base" slug={formatAddress(profile?.ownedBy)} />
          )}
          {currentProfile && currentProfile?.id !== profile?.id && profile?.isFollowing && (
            <div className="rounded-full bg-gray-200 py-0.5 px-2 text-xs dark:bg-gray-700">
              <Trans>Follows you</Trans>
            </div>
          )}
        </div>
      </div>
      {profile?.bio && (
        <div className="leading-md linkify text-md mr-0 break-words sm:mr-10">
          <Markup>{profile?.bio}</Markup>
        </div>
      )}
      <div className="space-y-5">
        <Followerings profile={profile} />
        <div>
          {currentProfile?.id === profile?.id ? (
            <Link href="/settings">
              <Button variant="secondary" icon={<CogIcon className="h-5 w-5" />} outline>
                <Trans>Edit Profile</Trans>
              </Button>
            </Link>
          ) : followType !== 'RevertFollowModuleSettings' ? (
            following ? (
              <div className="flex space-x-2">
                <Unfollow profile={profile} setFollowing={setFollowing} showText />
                {followType === 'FeeFollowModuleSettings' && (
                  <SuperFollow profile={profile} setFollowing={setFollowing} again />
                )}
                {currentProfile && <Message onClick={onMessageClick} />}
              </div>
            ) : followType === 'FeeFollowModuleSettings' ? (
              <div className="flex space-x-2">
                <SuperFollow profile={profile} setFollowing={setFollowing} showText />
                {currentProfile && <Message onClick={onMessageClick} />}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Follow
                  profile={profile}
                  setFollowing={setFollowing}
                  followSource={FollowSource.PROFILE_PAGE}
                  showText
                />
                {currentProfile && <Message onClick={onMessageClick} />}
              </div>
            )
          ) : null}
        </div>
        {currentProfile?.id !== profile?.id && (
          <>
            <MutualFollowers setShowMutualFollowersModal={setShowMutualFollowersModal} profile={profile} />
            <Modal
              title={t`Followers you know`}
              icon={<UsersIcon className="text-brand h-5 w-5" />}
              show={showMutualFollowersModal}
              onClose={() => setShowMutualFollowersModal(false)}
            >
              <MutualFollowersList profileId={profile?.id} />
            </Modal>
          </>
        )}
        <div className="divider w-full" />
        <div className="space-y-2">
          <MetaDetails icon={<HashtagIcon className="h-4 w-4" />}>
            <Tooltip content={`#${profile?.id}`}>
              <a
                href={`${RARIBLE_URL}/token/polygon/${getEnvConfig().lensHubProxyAddress}:${parseInt(
                  profile?.id
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                {parseInt(profile?.id)}
              </a>
            </Tooltip>
          </MetaDetails>
          {getAttribute(profile?.attributes, 'location') && (
            <MetaDetails icon={<LocationMarkerIcon className="h-4 w-4" />}>
              {getAttribute(profile?.attributes, 'location') as any}
            </MetaDetails>
          )}
          {profile?.onChainIdentity?.ens?.name && (
            <MetaDetails
              icon={
                <img
                  src={`${STATIC_IMAGES_URL}/brands/ens.svg`}
                  className="h-4 w-4"
                  height={16}
                  width={16}
                  alt="ENS Logo"
                />
              }
            >
              {profile?.onChainIdentity?.ens?.name}
            </MetaDetails>
          )}
          {getAttribute(profile?.attributes, 'website') && (
            <MetaDetails
              icon={
                <img
                  src={`https://www.google.com/s2/favicons?domain=${getAttribute(
                    profile?.attributes,
                    'website'
                  )
                    ?.replace('https://', '')
                    .replace('http://', '')}`}
                  className="h-4 w-4 rounded-full"
                  height={16}
                  width={16}
                  alt="Website"
                />
              }
            >
              <a
                href={`https://${getAttribute(profile?.attributes, 'website')
                  ?.replace('https://', '')
                  .replace('http://', '')}`}
                target="_blank"
                rel="noreferrer noopener me"
              >
                {getAttribute(profile?.attributes, 'website')?.replace('https://', '').replace('http://', '')}
              </a>
            </MetaDetails>
          )}
          {getAttribute(profile?.attributes, 'twitter') && (
            <MetaDetails
              icon={
                resolvedTheme === 'dark' ? (
                  <img
                    src={`${STATIC_IMAGES_URL}/brands/twitter-light.svg`}
                    className="h-4 w-4"
                    height={16}
                    width={16}
                    alt="Twitter Logo"
                  />
                ) : (
                  <img
                    src={`${STATIC_IMAGES_URL}/brands/twitter-dark.svg`}
                    className="h-4 w-4"
                    height={16}
                    width={16}
                    alt="Twitter Logo"
                  />
                )
              }
            >
              <a
                href={`https://twitter.com/${getAttribute(profile?.attributes, 'twitter')}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                {getAttribute(profile?.attributes, 'twitter')?.replace('https://twitter.com/', '')}
              </a>
            </MetaDetails>
          )}
        </div>
      </div>
      <Badges profile={profile} />
      {isStaff(currentProfile?.id) && staffMode && <ProfileStaffTool profile={profile} />}
    </div>
  );
};

export default Details;
