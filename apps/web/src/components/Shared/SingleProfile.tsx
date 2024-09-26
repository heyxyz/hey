import formatRelativeOrAbsolute from "@hey/helpers/datetime/formatRelativeOrAbsolute";
import getAvatar from "@hey/helpers/getAvatar";
import getLennyURL from "@hey/helpers/getLennyURL";
import getMentions from "@hey/helpers/getMentions";
import getProfile from "@hey/helpers/getProfile";
import humanize from "@hey/helpers/humanize";
import type { Profile } from "@hey/lens";
import { Image } from "@hey/ui";
import cn from "@hey/ui/cn";
import Link from "next/link";
import type { FC } from "react";
import { memo } from "react";
import Markup from "./Markup";
import FollowUnfollowButton from "./Profile/FollowUnfollowButton";
import Misuse from "./Profile/Icons/Misuse";
import Verified from "./Profile/Icons/Verified";
import ProfilePreview from "./ProfilePreview";
import Slug from "./Slug";

interface SingleProfileProps {
  hideFollowButton?: boolean;
  hideUnfollowButton?: boolean;
  isBig?: boolean;
  linkToProfile?: boolean;
  profile: Profile;
  showBio?: boolean;
  showId?: boolean;
  showUserPreview?: boolean;
  source?: string;
  timestamp?: Date;
}

const SingleProfile: FC<SingleProfileProps> = ({
  hideFollowButton = false,
  hideUnfollowButton = false,
  isBig = false,
  linkToProfile = true,
  profile,
  showBio = false,
  showId = false,
  showUserPreview = true,
  source,
  timestamp
}) => {
  const UserAvatar: FC = () => (
    <Image
      alt={profile.id}
      className={cn(
        isBig ? "size-14" : "size-11",
        "rounded-full border bg-gray-200 dark:border-gray-700"
      )}
      height={isBig ? 56 : 44}
      loading="lazy"
      onError={({ currentTarget }) => {
        currentTarget.src = getLennyURL(profile.id);
      }}
      src={getAvatar(profile)}
      width={isBig ? 56 : 44}
    />
  );

  const UserName: FC = () => (
    <>
      <div className="flex max-w-sm items-center">
        <div className={cn(isBig ? "font-bold" : "text-md", "grid")}>
          <div className="truncate font-semibold">
            {getProfile(profile).displayName}
          </div>
        </div>
        <Verified id={profile.id} iconClassName="ml-1 size-4" />
        <Misuse id={profile.id} iconClassName="ml-1 size-4" />
      </div>
      <div>
        <Slug className="text-sm" slug={getProfile(profile).slugWithPrefix} />
        {timestamp && (
          <span className="ld-text-gray-500">
            <span className="mx-1.5">·</span>
            <span className="text-xs">
              {formatRelativeOrAbsolute(timestamp)}
            </span>
          </span>
        )}
        {showId && (
          <span className="ld-text-gray-500">
            <span className="mx-1.5">·</span>
            <span className="text-xs">
              {humanize(Number.parseInt(profile.id))}
            </span>
          </span>
        )}
      </div>
    </>
  );

  const ProfileInfo: FC = () => (
    <ProfilePreview
      handle={profile.handle?.fullHandle}
      id={profile.id}
      showUserPreview={showUserPreview}
    >
      <div className="mr-8 flex items-center space-x-3">
        <UserAvatar />
        <div>
          <UserName />
          {showBio && profile?.metadata?.bio && (
            <div
              className={cn(
                isBig ? "text-base" : "text-sm",
                "mt-2",
                "linkify leading-6"
              )}
              style={{ wordBreak: "break-word" }}
            >
              <Markup mentions={getMentions(profile.metadata.bio)}>
                {profile?.metadata.bio}
              </Markup>
            </div>
          )}
        </div>
      </div>
    </ProfilePreview>
  );

  return (
    <div className="flex items-center justify-between">
      {linkToProfile && profile.id ? (
        <Link
          as={getProfile(profile).link}
          href={getProfile(profile, source).sourceLink}
        >
          <ProfileInfo />
        </Link>
      ) : (
        <ProfileInfo />
      )}
      <FollowUnfollowButton
        hideFollowButton={hideFollowButton}
        hideUnfollowButton={hideUnfollowButton}
        profile={profile}
        small
      />
    </div>
  );
};

export default memo(SingleProfile);
