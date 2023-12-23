import type { Profile } from '@hey/lens';
import type { FC, ReactNode } from 'react';

import Markup from '@components/Shared/Markup';
import Follow from '@components/Shared/Profile/Follow';
import Unfollow from '@components/Shared/Profile/Unfollow';
import Slug from '@components/Shared/Slug';
import SuperFollow from '@components/Shared/SuperFollow';
import {
  ClockIcon,
  Cog6ToothIcon,
  HashtagIcon,
  MapPinIcon,
  ShieldCheckIcon,
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
import getEnvConfig from '@hey/data/utils/getEnvConfig';
import { FollowModuleType } from '@hey/lens';
import formatDate from '@hey/lib/datetime/formatDate';
import getAvatar from '@hey/lib/getAvatar';
import getFavicon from '@hey/lib/getFavicon';
import getMentions from '@hey/lib/getMentions';
import getMisuseDetails from '@hey/lib/getMisuseDetails';
import getProfile from '@hey/lib/getProfile';
import getProfileAttribute from '@hey/lib/getProfileAttribute';
import hasMisused from '@hey/lib/hasMisused';
import { Button, Image, LightBox, Modal, Tooltip } from '@hey/ui';
import isVerified from '@lib/isVerified';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useState } from 'react';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';
import useProfileStore from 'src/store/persisted/useProfileStore';
import urlcat from 'urlcat';

import Badges from './Badges';
import Followerings from './Followerings';
import InvitedBy from './InvitedBy';
import ProfileMenu from './Menu';
import MutualFollowers from './MutualFollowers';
import MutualFollowersList from './MutualFollowers/List';
import ScamWarning from './ScamWarning';
import TbaBadge from './TbaBadge';

interface DetailsProps {
  profile: Profile;
}

const Details: FC<DetailsProps> = ({ profile }) => {
  const currentProfile = useProfileStore((state) => state.currentProfile);
  const staffMode = useFeatureFlagsStore((state) => state.staffMode);
  const [showMutualFollowersModal, setShowMutualFollowersModal] =
    useState(false);
  const [expandedImage, setExpandedImage] = useState<null | string>(null);
  const { resolvedTheme } = useTheme();

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
      <div className="relative -mt-24 size-32 sm:-mt-32 sm:size-52">
        <Image
          alt={profile.id}
          className="size-32 cursor-pointer rounded-xl bg-gray-200 ring-8 ring-gray-50 sm:size-52 dark:bg-gray-700 dark:ring-black"
          height={128}
          onClick={() => setExpandedImage(getAvatar(profile, EXPANDED_AVATAR))}
          src={getAvatar(profile)}
          width={128}
        />
        <LightBox
          onClose={() => setExpandedImage(null)}
          show={Boolean(expandedImage)}
          url={expandedImage}
        />
      </div>
      <div className="space-y-1 py-2">
        <div className="flex items-center gap-1.5 text-2xl font-bold">
          <div className="truncate">{getProfile(profile).displayName}</div>
          {isVerified(profile.id) ? (
            <Tooltip content="Verified">
              <CheckBadgeIcon className="text-brand-500 size-6" />
            </Tooltip>
          ) : null}
          <TbaBadge profile={profile} />
          {hasMisused(profile.id) ? (
            <Tooltip content={misuseDetails?.type}>
              <ExclamationCircleIcon className="size-6 text-red-500" />
            </Tooltip>
          ) : null}
        </div>
        <div className="flex items-center space-x-3">
          <Slug
            className="text-sm sm:text-base"
            slug={getProfile(profile).slugWithPrefix}
          />
          {profile.operations.isFollowingMe.value ? (
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
                icon={<Cog6ToothIcon className="size-5" />}
                outline
                variant="secondary"
              >
                Edit Profile
              </Button>
            </Link>
          ) : followType !== FollowModuleType.RevertFollowModule ? (
            profile.operations.isFollowedByMe.value ? (
              <>
                <Unfollow profile={profile} showText />
                {followType === FollowModuleType.FeeFollowModule ? (
                  <SuperFollow again profile={profile} />
                ) : null}
              </>
            ) : followType === FollowModuleType.FeeFollowModule ? (
              <SuperFollow profile={profile} showText />
            ) : (
              <Follow profile={profile} showText />
            )
          ) : null}

          <ProfileMenu profile={profile} />
        </div>
        {currentProfile?.id !== profile.id ? (
          <>
            <MutualFollowers
              profile={profile}
              setShowMutualFollowersModal={setShowMutualFollowersModal}
            />
            <Modal
              icon={<UsersIcon className="text-brand-500 size-5" />}
              onClose={() => setShowMutualFollowersModal(false)}
              show={showMutualFollowersModal}
              title="Followers you know"
            >
              <MutualFollowersList profile={profile} />
            </Modal>
          </>
        ) : null}
        <div className="divider w-full" />
        <div className="space-y-2">
          {staffMode ? (
            <MetaDetails
              icon={<ShieldCheckIcon className="size-4 text-yellow-600" />}
            >
              <Link
                className="text-yellow-600"
                href={getProfile(profile).staffLink}
              >
                Open in Staff Tools
              </Link>
            </MetaDetails>
          ) : null}
          <MetaDetails icon={<HashtagIcon className="size-4" />}>
            <Tooltip content={`#${profile.id}`}>
              <Link
                href={urlcat(RARIBLE_URL, '/token/polygon/:address::id', {
                  address: getEnvConfig().lensHubProxyAddress,
                  id: parseInt(profile.id)
                })}
                rel="noreferrer"
                target="_blank"
              >
                {parseInt(profile.id)}
              </Link>
            </Tooltip>
          </MetaDetails>
          {getProfileAttribute('location', profile?.metadata?.attributes) ? (
            <MetaDetails icon={<MapPinIcon className="size-4" />}>
              {getProfileAttribute('location', profile?.metadata?.attributes)}
            </MetaDetails>
          ) : null}
          {profile?.onchainIdentity?.ens?.name ? (
            <MetaDetails
              icon={
                <img
                  alt="ENS Logo"
                  className="size-4"
                  height={16}
                  src={`${STATIC_IMAGES_URL}/brands/ens.svg`}
                  width={16}
                />
              }
            >
              {profile?.onchainIdentity?.ens?.name}
            </MetaDetails>
          ) : null}
          {getProfileAttribute('website', profile?.metadata?.attributes) ? (
            <MetaDetails
              icon={
                <img
                  alt="Website"
                  className="size-4 rounded-full"
                  height={16}
                  src={getFavicon(
                    getProfileAttribute(
                      'website',
                      profile?.metadata?.attributes
                    )
                  )}
                  width={16}
                />
              }
            >
              <Link
                href={`https://${getProfileAttribute(
                  'website',
                  profile?.metadata?.attributes
                )
                  ?.replace('https://', '')
                  .replace('http://', '')}`}
                rel="noreferrer noopener me"
                target="_blank"
              >
                {getProfileAttribute('website', profile?.metadata?.attributes)
                  ?.replace('https://', '')
                  .replace('http://', '')}
              </Link>
            </MetaDetails>
          ) : null}
          {getProfileAttribute('x', profile?.metadata?.attributes) ? (
            <MetaDetails
              icon={
                <img
                  alt="X Logo"
                  className="size-4"
                  height={16}
                  src={`${STATIC_IMAGES_URL}/brands/${
                    resolvedTheme === 'dark' ? 'x-dark.png' : 'x-light.png'
                  }`}
                  width={16}
                />
              }
            >
              <Link
                href={urlcat('https://x.com/:username', {
                  username: getProfileAttribute(
                    'x',
                    profile?.metadata?.attributes
                  )?.replace('https://x.com/', '')
                })}
                rel="noreferrer noopener"
                target="_blank"
              >
                {getProfileAttribute(
                  'x',
                  profile?.metadata?.attributes
                )?.replace('https://x.com/', '')}
              </Link>
            </MetaDetails>
          ) : null}
          <MetaDetails icon={<ClockIcon className="size-4" />}>
            Joined {formatDate(profile.createdAt)}
          </MetaDetails>
        </div>
      </div>
      {profile.invitedBy ? (
        <>
          <div className="divider w-full" />
          <InvitedBy profile={profile.invitedBy} />
        </>
      ) : null}
      <Badges profile={profile} />
    </div>
  );
};

export default Details;
