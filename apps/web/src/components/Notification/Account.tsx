import AccountPreview from "@components/Shared/AccountPreview";
import Misuse from "@components/Shared/Profile/Icons/Misuse";
import Verified from "@components/Shared/Profile/Icons/Verified";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import getLennyURL from "@hey/helpers/getLennyURL";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { Profile } from "@hey/lens";
import { Image } from "@hey/ui";
import Link from "next/link";
import type { FC, SyntheticEvent } from "react";

interface NotificationProfileProps {
  account: Profile;
}

export const NotificationAccountAvatar: FC<NotificationProfileProps> = ({
  account
}) => {
  const handleImageError = (event: SyntheticEvent<HTMLImageElement>) => {
    const target = event.currentTarget;
    target.src = getLennyURL(account.id);
  };

  return (
    <AccountPreview handle={account.handle?.fullHandle} id={account.id}>
      <Link
        className="rounded-full outline-offset-2"
        href={getAccount(account).link}
        onClick={stopEventPropagation}
      >
        <Image
          alt={account.id}
          className="size-7 rounded-full border bg-gray-200 sm:size-8 dark:border-gray-700"
          height={32}
          onError={handleImageError}
          src={getAvatar(account)}
          width={32}
        />
      </Link>
    </AccountPreview>
  );
};

export const NotificationAccountName: FC<NotificationProfileProps> = ({
  account
}) => {
  const profileLink = getAccount(account).link;

  return (
    <AccountPreview handle={account.handle?.fullHandle} id={account.id}>
      <Link
        className="inline-flex items-center space-x-1 font-bold outline-none hover:underline focus:underline"
        href={profileLink}
        onClick={stopEventPropagation}
      >
        <span>{getAccount(account).displayName}</span>
        <Verified id={account.id} iconClassName="size-4" />
        <Misuse id={account.id} iconClassName="size-4" />
      </Link>
    </AccountPreview>
  );
};
