import formatRelativeOrAbsolute from "@hey/helpers/datetime/formatRelativeOrAbsolute";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import getLennyURL from "@hey/helpers/getLennyURL";
import getMentions from "@hey/helpers/getMentions";
import humanize from "@hey/helpers/humanize";
import type { Profile } from "@hey/lens";
import { Image } from "@hey/ui";
import cn from "@hey/ui/cn";
import Link from "next/link";
import type { FC } from "react";
import { memo } from "react";
import AccountPreview from "./AccountPreview";
import Markup from "./Markup";
import FollowUnfollowButton from "./Profile/FollowUnfollowButton";
import Misuse from "./Profile/Icons/Misuse";
import Verified from "./Profile/Icons/Verified";
import Slug from "./Slug";

interface SingleAccountProps {
  hideFollowButton?: boolean;
  hideUnfollowButton?: boolean;
  isBig?: boolean;
  linkToAccount?: boolean;
  account: Profile;
  showBio?: boolean;
  showId?: boolean;
  showUserPreview?: boolean;
  source?: string;
  timestamp?: Date;
}

const SingleAccount: FC<SingleAccountProps> = ({
  hideFollowButton = false,
  hideUnfollowButton = false,
  isBig = false,
  linkToAccount = true,
  account,
  showBio = false,
  showId = false,
  showUserPreview = true,
  source,
  timestamp
}) => {
  const UserAvatar: FC = () => (
    <Image
      alt={account.id}
      className={cn(
        isBig ? "size-14" : "size-11",
        "rounded-full border bg-gray-200 dark:border-gray-700"
      )}
      height={isBig ? 56 : 44}
      loading="lazy"
      onError={({ currentTarget }) => {
        currentTarget.src = getLennyURL(account.id);
      }}
      src={getAvatar(account)}
      width={isBig ? 56 : 44}
    />
  );

  const UserName: FC = () => (
    <>
      <div className="flex max-w-sm items-center">
        <div className={cn(isBig ? "font-bold" : "text-md", "grid")}>
          <div className="truncate font-semibold">
            {getAccount(account).displayName}
          </div>
        </div>
        <Verified id={account.id} iconClassName="ml-1 size-4" />
        <Misuse id={account.id} iconClassName="ml-1 size-4" />
      </div>
      <div>
        <Slug className="text-sm" slug={getAccount(account).slugWithPrefix} />
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
              {humanize(Number.parseInt(account.id))}
            </span>
          </span>
        )}
      </div>
    </>
  );

  const AccountInfo: FC = () => (
    <AccountPreview
      handle={account.handle?.fullHandle}
      id={account.id}
      showUserPreview={showUserPreview}
    >
      <div className="mr-8 flex items-center space-x-3">
        <UserAvatar />
        <div>
          <UserName />
          {showBio && account?.metadata?.bio && (
            <div
              className={cn(
                isBig ? "text-base" : "text-sm",
                "mt-2",
                "linkify leading-6"
              )}
              style={{ wordBreak: "break-word" }}
            >
              <Markup mentions={getMentions(account.metadata.bio)}>
                {account?.metadata.bio}
              </Markup>
            </div>
          )}
        </div>
      </div>
    </AccountPreview>
  );

  return (
    <div className="flex items-center justify-between">
      {linkToAccount && account.id ? (
        <Link
          as={getAccount(account).link}
          href={getAccount(account, source).sourceLink}
        >
          <AccountInfo />
        </Link>
      ) : (
        <AccountInfo />
      )}
      <FollowUnfollowButton
        hideFollowButton={hideFollowButton}
        hideUnfollowButton={hideUnfollowButton}
        account={account}
        small
      />
    </div>
  );
};

export default memo(SingleAccount);
