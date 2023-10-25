import Message from '@components/Profile/Message';
import Markup from '@components/Shared/Markup';
import Follow from '@components/Shared/Profile/Follow';
import Unfollow from '@components/Shared/Profile/Unfollow';
import Slug from '@components/Shared/Slug';
import SuperFollow from '@components/Shared/SuperFollow';
import ProfileStaffTool from '@components/StaffTools/Panels/Profile';
import {
  Cog6ToothIcon,
  HashtagIcon,
  MapPinIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import {
  CheckBadgeIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/solid';
import {
  EXPANDED_AVATAR,
  RARIBLE_URL,
  STATIC_IMAGES_URL
} from '@hey/data/constants';
import { FollowUnfollowSource } from '@hey/data/tracking';
import getEnvConfig from '@hey/data/utils/getEnvConfig';
import type { Profile } from '@hey/lens';
import { FollowModuleType } from '@hey/lens';
import getAvatar from '@hey/lib/getAvatar';
import getMentions from '@hey/lib/getMentions';
import getMisuseDetails from '@hey/lib/getMisuseDetails';
import getProfile from '@hey/lib/getProfile';
import getProfileAttribute from '@hey/lib/getProfileAttribute';
import hasMisused from '@hey/lib/hasMisused';
import { Button, Image, LightBox, Modal, Tooltip } from '@hey/ui';
import buildConversationId from '@lib/buildConversationId';
import { buildConversationKey } from '@lib/conversationKey';
import isVerified from '@lib/isVerified';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { useMessageDb } from 'src/hooks/useMessageDb';
import { useAppStore } from 'src/store/useAppStore';
import { useMessageStore } from 'src/store/useMessageStore';
import { usePreferencesStore } from 'src/store/usePreferencesStore';
import urlcat from 'urlcat';

import Badges from './Badges';
import Followerings from './Followerings';
import InvitedBy from './InvitedBy';
import ProfileMenu from './Menu';
import MutualFollowers from './MutualFollowers';
import MutualFollowersList from './MutualFollowers/List';
import ScamWarning from './ScamWarning';

interface DetailsProps {
  profile: Profile;
  following: boolean;
  setFollowing: (following: boolean) => void;
}

const Details: FC<DetailsProps> = ({ profile, following, setFollowing }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setConversationKey = useMessageStore(
    (state) => state.setConversationKey
  );
  const isStaff = usePreferencesStore((state) => state.isStaff);
  const staffMode = usePreferencesStore((state) => state.staffMode);
  const [showMutualFollowersModal, setShowMutualFollowersModal] =
    useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const { persistProfile } = useMessageDb();

  const onMessageClick = () => {
    if (!currentProfile) {
      return;
    }
    const conversationId = buildConversationId(currentProfile.id, profile.id);
    const conversationKey = buildConversationKey(
      profile.ownedBy.address,
      conversationId
    );
    persistProfile(conversationKey, profile);
    setConversationKey(conversationKey);
  };

  const MetaDetails = ({
    children,
    icon
  }: {
    children: ReactNode;
    icon: ReactNode;
  }) => (
    <div className="flex items-center gap-2">
      {icon}
      <div className="text-md truncate">{children}</div>
    </div>
  );

  const followType = profile?.followModule?.type;
  const misuseDetails = getMisuseDetails(profile.id);

  return (
    <div className="mb-4 space-y-5 px-5 sm:px-0">
      <div className="relative -mt-24 h-32 w-32 sm:-mt-32 sm:h-52 sm:w-52">
        <Image
          onClick={() => setExpandedImage(getAvatar(profile, EXPANDED_AVATAR))}
          src={getAvatar(profile)}
          className="h-32 w-32 cursor-pointer rounded-xl bg-gray-200 ring-8 ring-gray-50 dark:bg-gray-700 dark:ring-black sm:h-52 sm:w-52"
          height={128}
          width={128}
          alt={profile.id}
        />
        <LightBox
          show={Boolean(expandedImage)}
          url={expandedImage}
          onClose={() => setExpandedImage(null)}
        />
      </div>
      <div className="space-y-1 py-2">
        <div className="flex items-center gap-1.5 text-2xl font-bold">
          <div className="truncate">{getProfile(profile).displayName}</div>
          {isVerified(profile.id) ? (
            <Tooltip content="Verified">
              <CheckBadgeIcon className="text-brand h-6 w-6" />
            </Tooltip>
          ) : null}
          {hasMisused(profile.id) ? (
            <Tooltip content={misuseDetails?.type}>
              <ExclamationCircleIcon className="h-6 w-6 text-red-500" />
            </Tooltip>
          ) : null}
        </div>
        <div className="flex items-center space-x-3">
          <Slug
            className="text-sm sm:text-base"
            slug={getProfile(profile).slug}
            prefix={getProfile(profile).prefix}
          />
          {currentProfile &&
          currentProfile?.id !== profile.id &&
          profile.operations.isFollowingMe.value ? (
            <div className="rounded-full bg-gray-200 px-2 py-0.5 text-xs dark:bg-gray-700">
              Follows you
            </div>
          ) : null}
        </div>
      </div>
      {profile?.metadata?.bio ? (
        <div className="markup linkify text-md mr-0 break-words sm:mr-10">
          <Markup mentions={getMentions(profile?.metadata.bio)}>
            {profile?.metadata.bio}
          </Markup>
        </div>
      ) : null}
      <div className="space-y-5">
        <ScamWarning profile={profile} />
        <Followerings profile={profile} />
        <div className="flex items-center space-x-2">
          {currentProfile?.id === profile.id ? (
            <Link href="/settings">
              <Button
                variant="secondary"
                icon={<Cog6ToothIcon className="h-5 w-5" />}
                outline
              >
                Edit Profile
              </Button>
            </Link>
          ) : followType !== FollowModuleType.RevertFollowModule ? (
            following ? (
              <>
                <Unfollow
                  profile={profile}
                  setFollowing={setFollowing}
                  showText
                />
                {followType === FollowModuleType.FeeFollowModule ? (
                  <SuperFollow
                    profile={profile}
                    setFollowing={setFollowing}
                    again
                  />
                ) : null}
              </>
            ) : followType === FollowModuleType.FeeFollowModule ? (
              <SuperFollow
                profile={profile}
                setFollowing={setFollowing}
                followUnfollowSource={FollowUnfollowSource.PROFILE_PAGE}
                showText
              />
            ) : (
              <Follow
                profile={profile}
                setFollowing={setFollowing}
                followUnfollowSource={FollowUnfollowSource.PROFILE_PAGE}
                showText
              />
            )
          ) : null}
          {currentProfile ? <Message onClick={onMessageClick} /> : null}
          <ProfileMenu profile={profile} />
        </div>
        {currentProfile?.id !== profile.id ? (
          <>
            <MutualFollowers
              setShowMutualFollowersModal={setShowMutualFollowersModal}
              profile={profile}
            />
            <Modal
              title="Followers you know"
              icon={<UsersIcon className="text-brand h-5 w-5" />}
              show={showMutualFollowersModal}
              onClose={() => setShowMutualFollowersModal(false)}
            >
              <MutualFollowersList profileId={profile.id} />
            </Modal>
          </>
        ) : null}
        <div className="divider w-full" />
        <div className="space-y-2">
          <MetaDetails icon={<HashtagIcon className="h-4 w-4" />}>
            <Tooltip content={`#${profile.id}`}>
              <Link
                href={urlcat(RARIBLE_URL, '/token/polygon/:address::id', {
                  address: getEnvConfig().lensHubProxyAddress,
                  id: parseInt(profile.id)
                })}
                target="_blank"
                rel="noreferrer"
              >
                {parseInt(profile.id)}
              </Link>
            </Tooltip>
          </MetaDetails>
          {getProfileAttribute(profile?.metadata?.attributes, 'location') ? (
            <MetaDetails icon={<MapPinIcon className="h-4 w-4" />}>
              {getProfileAttribute(profile?.metadata?.attributes, 'location')}
            </MetaDetails>
          ) : null}
          {profile?.onchainIdentity?.ens?.name ? (
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
              {profile?.onchainIdentity?.ens?.name}
            </MetaDetails>
          ) : null}
          {getProfileAttribute(profile?.metadata?.attributes, 'website') ? (
            <MetaDetails
              icon={
                <img
                  src={urlcat(
                    'https://external-content.duckduckgo.com/ip3/:domain.ico',
                    {
                      domain: getProfileAttribute(
                        profile?.metadata?.attributes,
                        'website'
                      )
                        ?.replace('https://', '')
                        .replace('http://', '')
                    }
                  )}
                  className="h-4 w-4 rounded-full"
                  height={16}
                  width={16}
                  alt="Website"
                />
              }
            >
              <Link
                href={`https://${getProfileAttribute(
                  profile?.metadata?.attributes,
                  'website'
                )
                  ?.replace('https://', '')
                  .replace('http://', '')}`}
                target="_blank"
                rel="noreferrer noopener me"
              >
                {getProfileAttribute(profile?.metadata?.attributes, 'website')
                  ?.replace('https://', '')
                  .replace('http://', '')}
              </Link>
            </MetaDetails>
          ) : null}
          {getProfileAttribute(profile?.metadata?.attributes, 'x') ? (
            <MetaDetails
              icon={
                <img
                  src={`${STATIC_IMAGES_URL}/brands/${
                    resolvedTheme === 'dark' ? 'x-dark.png' : 'x-light.png'
                  }`}
                  className="h-4 w-4"
                  height={16}
                  width={16}
                  alt="X Logo"
                />
              }
            >
              <Link
                href={urlcat('https://x.com/:username', {
                  username: getProfileAttribute(
                    profile?.metadata?.attributes,
                    'x'
                  )?.replace('https://x.com/', '')
                })}
                target="_blank"
                rel="noreferrer noopener"
              >
                {getProfileAttribute(
                  profile?.metadata?.attributes,
                  'x'
                )?.replace('https://x.com/', '')}
              </Link>
            </MetaDetails>
          ) : null}
        </div>
      </div>
      {profile.invitedBy ? (
        <>
          <div className="divider w-full" />
          <InvitedBy profile={profile.invitedBy} />
        </>
      ) : null}
      <Badges profile={profile} />
      {isStaff && staffMode ? <ProfileStaffTool profile={profile} /> : null}
    </div>
  );
};

export default Details;
