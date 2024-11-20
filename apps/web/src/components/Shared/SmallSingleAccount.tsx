import formatRelativeOrAbsolute from "@hey/helpers/datetime/formatRelativeOrAbsolute";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import getLennyURL from "@hey/helpers/getLennyURL";
import type { Profile } from "@hey/lens";
import { Image } from "@hey/ui";
import cn from "@hey/ui/cn";
import Link from "next/link";
import type { FC } from "react";
import { memo } from "react";
import Misuse from "./Profile/Icons/Misuse";
import Verified from "./Profile/Icons/Verified";
import Slug from "./Slug";

interface SmallSingleAccountProps {
  hideSlug?: boolean;
  linkToAccount?: boolean;
  account: Profile;
  smallAvatar?: boolean;
  timestamp?: Date;
}

const SmallSingleAccount: FC<SmallSingleAccountProps> = ({
  hideSlug = false,
  linkToAccount = false,
  account,
  smallAvatar = false,
  timestamp = ""
}) => {
  const UserAvatar: FC = () => (
    <Image
      alt={account.id}
      className={cn(
        smallAvatar ? "size-4" : "size-6",
        "rounded-full border bg-gray-200 dark:border-gray-700"
      )}
      height={smallAvatar ? 16 : 24}
      loading="lazy"
      onError={({ currentTarget }) => {
        currentTarget.src = getLennyURL(account.id);
      }}
      src={getAvatar(account)}
      width={smallAvatar ? 16 : 24}
    />
  );

  const UserName: FC = () => (
    <div className="flex max-w-full flex-wrap items-center">
      <div className={cn(!hideSlug && "max-w-[75%]", "mr-1 truncate")}>
        {getAccount(account).displayName}
      </div>
      <Verified id={account.id} iconClassName="mr-1 size-4" />
      <Misuse id={account.id} iconClassName="mr-2 size-4" />
      {!hideSlug && (
        <Slug className="text-sm" slug={getAccount(account).slugWithPrefix} />
      )}
      {timestamp && (
        <span className="ld-text-gray-500">
          <span className="mx-1.5">·</span>
          <span className="text-xs">{formatRelativeOrAbsolute(timestamp)}</span>
        </span>
      )}
    </div>
  );

  const AccountInfo: FC = () => (
    <div className="flex items-center space-x-2">
      <UserAvatar />
      <UserName />
    </div>
  );

  return linkToAccount ? (
    <Link href={getAccount(account).link}>
      <AccountInfo />
    </Link>
  ) : (
    <AccountInfo />
  );
};

export default memo(SmallSingleAccount);
