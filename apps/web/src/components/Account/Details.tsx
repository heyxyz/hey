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
import getAccount from "@hey/helpers/getAccount";
import getAccountAttribute from "@hey/helpers/getAccountAttribute";
import getAvatar from "@hey/helpers/getAvatar";
import getFavicon from "@hey/helpers/getFavicon";
import getLennyURL from "@hey/helpers/getLennyURL";
import getMentions from "@hey/helpers/getMentions";
import type { Profile } from "@hey/lens";
import { FollowModuleType } from "@hey/lens";
import { Button, Drawer, H3, Image, LightBox, Tooltip } from "@hey/ui";
import { useFlag } from "@unleash/proxy-client-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import urlcat from "urlcat";
import AccountStatus from "./AccountStatus";
import Badges from "./Badges";
import Followerings from "./Followerings";
import InternalTools from "./InternalTools";
import AccountMenu from "./Menu";
import MutualFollowersOverview from "./MutualFollowersOverview";
import ScamWarning from "./ScamWarning";
import UpdateTheme from "./UpdateTheme";

const MetaDetails = ({
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
  account: Profile;
}

const Details: FC<DetailsProps> = ({ isSuspended = false, account }) => {
  const { push } = useRouter();
  const { currentAccount } = useAccountStore();
  const [expandedImage, setExpandedImage] = useState<null | string>(null);
  const [showPersonalizeModal, setShowPersonalizeModal] = useState(false);
  const isStaff = useFlag(FeatureFlag.Staff);
  const { resolvedTheme } = useTheme();

  const followType = account?.followModule?.type;

  return (
    <div className="mb-4 space-y-5 px-5 sm:px-0">
      <div className="-mt-24 sm:-mt-32 relative size-32 sm:size-52">
        <Image
          alt={account.id}
          className="size-32 cursor-pointer rounded-full bg-gray-200 ring-8 ring-gray-50 sm:size-52 dark:bg-gray-700 dark:ring-black"
          height={128}
          onClick={() => setExpandedImage(getAvatar(account, EXPANDED_AVATAR))}
          onError={({ currentTarget }) => {
            currentTarget.src = getLennyURL(account.id);
          }}
          src={getAvatar(account)}
          width={128}
        />
        <LightBox onClose={() => setExpandedImage(null)} url={expandedImage} />
      </div>
      <div className="space-y-1 py-2">
        <div className="flex items-center gap-1.5">
          <H3 className="truncate">{getAccount(account).displayName}</H3>
          <Verified id={account.id} showTooltip />
          <Misuse id={account.id} showTooltip />
          {isSuspended ? (
            <Tooltip content="Suspended">
              <EyeSlashIcon className="size-6 text-brand-500" />
            </Tooltip>
          ) : null}
          <AccountStatus id={account.id} />
        </div>
        <div className="flex items-center space-x-3">
          <Slug
            className="text-sm sm:text-base"
            slug={getAccount(account).slugWithPrefix}
          />
          {account.operations.isFollowingMe.value ? (
            <div className="rounded-full bg-gray-200 px-2 py-0.5 text-xs dark:bg-gray-700">
              Follows you
            </div>
          ) : null}
        </div>
      </div>
      {account?.metadata?.bio ? (
        <div className="markup linkify mr-0 break-words text-md sm:mr-10">
          <Markup mentions={getMentions(account?.metadata.bio)}>
            {account?.metadata.bio}
          </Markup>
        </div>
      ) : null}
      <div className="space-y-5">
        <ScamWarning accountId={account.id} />
        <Followerings account={account} />
        <div className="flex items-center space-x-2">
          {currentAccount?.id === account.id ? (
            <>
              <Button
                icon={<Cog6ToothIcon className="size-5" />}
                onClick={() => push("/settings")}
                outline
              >
                Edit Profile
              </Button>
              <Button
                icon={<PaintBrushIcon className="size-5" />}
                onClick={() => setShowPersonalizeModal(true)}
                outline
              >
                Personalize
              </Button>
            </>
          ) : followType !== FollowModuleType.RevertFollowModule ? (
            <FollowUnfollowButton account={account} />
          ) : null}
          <AccountMenu account={account} />
        </div>
        {currentAccount?.id !== account.id ? (
          <MutualFollowersOverview
            handle={getAccount(account).slug}
            accountId={account.id}
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
                href={getAccount(account).staffLink}
              >
                Open in Staff Tools
              </Link>
            </MetaDetails>
          ) : null}
          <MetaDetails icon={<HashtagIcon className="size-4" />}>
            {Number.parseInt(account.id)}
          </MetaDetails>
          {getAccountAttribute("location", account?.metadata?.attributes) ? (
            <MetaDetails icon={<MapPinIcon className="size-4" />}>
              {getAccountAttribute("location", account?.metadata?.attributes)}
            </MetaDetails>
          ) : null}
          {getAccountAttribute("website", account?.metadata?.attributes) ? (
            <MetaDetails
              icon={
                <img
                  alt="Website"
                  className="size-4 rounded-full"
                  height={16}
                  src={getFavicon(
                    getAccountAttribute(
                      "website",
                      account?.metadata?.attributes
                    )
                  )}
                  width={16}
                />
              }
            >
              <Link
                href={`https://${getAccountAttribute(
                  "website",
                  account?.metadata?.attributes
                )
                  ?.replace("https://", "")
                  .replace("http://", "")}`}
                rel="noreferrer noopener me"
                target="_blank"
              >
                {getAccountAttribute("website", account?.metadata?.attributes)
                  ?.replace("https://", "")
                  .replace("http://", "")}
              </Link>
            </MetaDetails>
          ) : null}
          {getAccountAttribute("x", account?.metadata?.attributes) ? (
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
                  username: getAccountAttribute(
                    "x",
                    account?.metadata?.attributes
                  )?.replace("https://x.com/", "")
                })}
                rel="noreferrer noopener"
                target="_blank"
              >
                {getAccountAttribute(
                  "x",
                  account?.metadata?.attributes
                )?.replace("https://x.com/", "")}
              </Link>
            </MetaDetails>
          ) : null}
          <MetaDetails icon={<ClockIcon className="size-4" />}>
            Joined {formatDate(account.createdAt)}
          </MetaDetails>
        </div>
      </div>
      <Badges id={account.id} />
      <InternalTools account={account} />
      <Drawer
        title="Personalize"
        onClose={() => setShowPersonalizeModal(false)}
        show={showPersonalizeModal}
      >
        <UpdateTheme />
      </Drawer>
    </div>
  );
};

export default Details;
