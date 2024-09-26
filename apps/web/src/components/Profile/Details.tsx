import Markup from "@components/Shared/Markup";
import FollowUnfollowButton from "@components/Shared/Profile/FollowUnfollowButton";
import Misuse from "@components/Shared/Profile/Icons/Misuse";
import Verified from "@components/Shared/Profile/Icons/Verified";
import Slug from "@components/Shared/Slug";
import {
  ClockIcon,
  Cog6ToothIcon,
  HashtagIcon,
  MapPinIcon,
  PaintBrushIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";
import { EyeSlashIcon } from "@heroicons/react/24/solid";
import { EXPANDED_AVATAR, STATIC_IMAGES_URL } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import formatDate from "@hey/helpers/datetime/formatDate";
import getAvatar from "@hey/helpers/getAvatar";
import getFavicon from "@hey/helpers/getFavicon";
import getLennyURL from "@hey/helpers/getLennyURL";
import getMentions from "@hey/helpers/getMentions";
import getProfile from "@hey/helpers/getProfile";
import getProfileAttribute from "@hey/helpers/getProfileAttribute";
import type { Profile } from "@hey/lens";
import { FollowModuleType } from "@hey/lens";
import { Button, H3, Image, LightBox, Modal, Tooltip } from "@hey/ui";
import { useFlag } from "@unleash/proxy-client-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import { useProStore } from "src/store/non-persisted/useProStore";
import { useProfileStore } from "src/store/persisted/useProfileStore";
import urlcat from "urlcat";
import Pro from "../Shared/Profile/Icons/Pro";
import Badges from "./Badges";
import Followerings from "./Followerings";
import InternalTools from "./InternalTools";
import ProfileMenu from "./Menu";
import MutualFollowersOverview from "./MutualFollowersOverview";
import ProfileStatus from "./ProfileStatus";
import ScamWarning from "./ScamWarning";

export const MetaDetails = ({
  children,
  icon
}: {
  children: ReactNode;
  icon: ReactNode;
}) => (
  <div className="flex items-center gap-2">
    {icon}
    <div className="truncate text-md">{children}</div>
  </div>
);

interface DetailsProps {
  isSuspended: boolean;
  profile: Profile;
}

const Details: FC<DetailsProps> = ({ isSuspended = false, profile }) => {
  const { push } = useRouter();
  const { currentProfile } = useProfileStore();
  const { isPro } = useProStore();
  const [expandedImage, setExpandedImage] = useState<null | string>(null);
  const [showPersonalizeModal, setShowPersonalizeModal] = useState(false);
  const isStaff = useFlag(FeatureFlag.Staff);
  const { resolvedTheme } = useTheme();

  const followType = profile?.followModule?.type;

  return (
    <div className="mb-4 space-y-5 px-5 sm:px-0">
      <div className="-mt-24 sm:-mt-32 relative size-32 sm:size-52">
        <Image
          alt={profile.id}
          className="size-32 cursor-pointer rounded-full bg-gray-200 ring-8 ring-gray-50 sm:size-52 dark:bg-gray-700 dark:ring-black"
          height={128}
          onClick={() => setExpandedImage(getAvatar(profile, EXPANDED_AVATAR))}
          onError={({ currentTarget }) => {
            currentTarget.src = getLennyURL(profile.id);
          }}
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
        <div className="flex items-center gap-1.5">
          <H3 className="truncate">{getProfile(profile).displayName}</H3>
          <Verified id={profile.id} showTooltip />
          <Misuse id={profile.id} showTooltip />
          {isSuspended ? (
            <Tooltip content="Suspended">
              <EyeSlashIcon className="size-6 text-brand-500" />
            </Tooltip>
          ) : null}
          <Pro id={profile.id} />
          <ProfileStatus id={profile.id} />
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
        <div className="markup linkify mr-0 break-words text-md sm:mr-10">
          <Markup mentions={getMentions(profile?.metadata.bio)}>
            {profile?.metadata.bio}
          </Markup>
        </div>
      ) : null}
      <div className="space-y-5">
        <ScamWarning profileId={profile.id} />
        <Followerings profile={profile} />
        <div className="flex items-center space-x-2">
          {currentProfile?.id === profile.id ? (
            <>
              <Button
                icon={<Cog6ToothIcon className="size-5" />}
                onClick={() => push("/settings")}
                outline
              >
                Edit Profile
              </Button>
              {isPro && (
                <Button
                  icon={<PaintBrushIcon className="size-5" />}
                  onClick={() => setShowPersonalizeModal(true)}
                  outline
                >
                  Personalize
                </Button>
              )}
            </>
          ) : followType !== FollowModuleType.RevertFollowModule ? (
            <FollowUnfollowButton profile={profile} />
          ) : null}
          <ProfileMenu profile={profile} />
        </div>
        {currentProfile?.id !== profile.id ? (
          <MutualFollowersOverview
            handle={getProfile(profile).slug}
            profileId={profile.id}
          />
        ) : null}
        <div className="divider w-full" />
        <div className="space-y-2">
          {isStaff ? (
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
            {Number.parseInt(profile.id)}
          </MetaDetails>
          {getProfileAttribute("location", profile?.metadata?.attributes) ? (
            <MetaDetails icon={<MapPinIcon className="size-4" />}>
              {getProfileAttribute("location", profile?.metadata?.attributes)}
            </MetaDetails>
          ) : null}
          {getProfileAttribute("website", profile?.metadata?.attributes) ? (
            <MetaDetails
              icon={
                <img
                  alt="Website"
                  className="size-4 rounded-full"
                  height={16}
                  src={getFavicon(
                    getProfileAttribute(
                      "website",
                      profile?.metadata?.attributes
                    )
                  )}
                  width={16}
                />
              }
            >
              <Link
                href={`https://${getProfileAttribute(
                  "website",
                  profile?.metadata?.attributes
                )
                  ?.replace("https://", "")
                  .replace("http://", "")}`}
                rel="noreferrer noopener me"
                target="_blank"
              >
                {getProfileAttribute("website", profile?.metadata?.attributes)
                  ?.replace("https://", "")
                  .replace("http://", "")}
              </Link>
            </MetaDetails>
          ) : null}
          {getProfileAttribute("x", profile?.metadata?.attributes) ? (
            <MetaDetails
              icon={
                <img
                  alt="X Logo"
                  className="size-4"
                  height={16}
                  src={`${STATIC_IMAGES_URL}/brands/${
                    resolvedTheme === "dark" ? "x-dark.png" : "x-light.png"
                  }`}
                  width={16}
                />
              }
            >
              <Link
                href={urlcat("https://x.com/:username", {
                  username: getProfileAttribute(
                    "x",
                    profile?.metadata?.attributes
                  )?.replace("https://x.com/", "")
                })}
                rel="noreferrer noopener"
                target="_blank"
              >
                {getProfileAttribute(
                  "x",
                  profile?.metadata?.attributes
                )?.replace("https://x.com/", "")}
              </Link>
            </MetaDetails>
          ) : null}
          <MetaDetails icon={<ClockIcon className="size-4" />}>
            Joined {formatDate(profile.createdAt)}
          </MetaDetails>
        </div>
      </div>
      <Badges id={profile.id} />
      <InternalTools profile={profile} />
      <Modal
        onClose={() => setShowPersonalizeModal(false)}
        show={showPersonalizeModal}
        title="Personalize"
      >
        WIP
      </Modal>
    </div>
  );
};

export default Details;
