import Misuse from "@components/Shared/Profile/Icons/Misuse";
import Verified from "@components/Shared/Profile/Icons/Verified";
import UserPreview from "@components/Shared/UserPreview";
import getAvatar from "@hey/helpers/getAvatar";
import getLennyURL from "@hey/helpers/getLennyURL";
import getProfile from "@hey/helpers/getProfile";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { Profile } from "@hey/lens";
import { Image } from "@hey/ui";
import Link from "next/link";
import type { FC } from "react";

interface NotificationProfileProps {
  profile: Profile;
}

export const NotificationProfileAvatar: FC<NotificationProfileProps> = ({
  profile
}) => {
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget;
    target.src = getLennyURL(profile.id);
  };

  return (
    <UserPreview handle={profile.handle?.fullHandle} id={profile.id}>
      <Link
        className="rounded-full outline-offset-2"
        href={getProfile(profile).link}
        onClick={stopEventPropagation}
      >
        <Image
          alt={profile.id}
          className="size-7 rounded-full border bg-gray-200 sm:size-8 dark:border-gray-700"
          height={32}
          onError={handleImageError}
          src={getAvatar(profile)}
          width={32}
        />
      </Link>
    </UserPreview>
  );
};

export const NotificationProfileName: FC<NotificationProfileProps> = ({
  profile
}) => {
  const profileLink = getProfile(profile).link;

  return (
    <UserPreview handle={profile.handle?.fullHandle} id={profile.id}>
      <Link
        className="inline-flex items-center space-x-1 font-bold outline-none hover:underline focus:underline"
        href={profileLink}
        onClick={stopEventPropagation}
      >
        <span>{getProfile(profile).displayName}</span>
        <Verified id={profile.id} iconClassName="size-4" />
        <Misuse id={profile.id} iconClassName="size-4" />
      </Link>
    </UserPreview>
  );
};
