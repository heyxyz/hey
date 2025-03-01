import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import getMentions from "@hey/helpers/getMentions";
import type { AccountFragment } from "@hey/indexer";
import { Image } from "@hey/ui";
import cn from "@hey/ui/cn";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import { memo } from "react";
import FollowUnfollowButton from "./Account/FollowUnfollowButton";
import Verified from "./Account/Icons/Verified";
import AccountPreview from "./AccountPreview";
import Markup from "./Markup";
import Slug from "./Slug";

interface SingleAccountProps {
  hideFollowButton?: boolean;
  hideUnfollowButton?: boolean;
  isBig?: boolean;
  linkToAccount?: boolean;
  account: AccountFragment;
  showBio?: boolean;
  showUserPreview?: boolean;
  menu?: ReactNode;
}

const SingleAccount: FC<SingleAccountProps> = ({
  hideFollowButton = false,
  hideUnfollowButton = false,
  isBig = false,
  linkToAccount = true,
  account,
  showBio = false,
  showUserPreview = true,
  menu
}) => {
  const UserAvatar: FC = () => (
    <Image
      alt={account.address}
      className={cn(
        isBig ? "size-14" : "size-11",
        "rounded-full border bg-gray-200 dark:border-gray-700"
      )}
      height={isBig ? 56 : 44}
      loading="lazy"
      src={getAvatar(account)}
      width={isBig ? 56 : 44}
    />
  );

  const UserName: FC = () => (
    <>
      <div className="flex max-w-sm items-center">
        <div className={cn(isBig ? "font-bold" : "text-md", "grid")}>
          <div className="truncate font-semibold">
            {getAccount(account).name}
          </div>
        </div>
        <Verified address={account.address} iconClassName="ml-1 size-4" />
      </div>
      <Slug className="text-sm" slug={getAccount(account).usernameWithPrefix} />
    </>
  );

  const AccountInfo: FC = () => (
    <AccountPreview
      handle={account.username?.localName}
      address={account.address}
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
      {linkToAccount && account.address ? (
        <Link href={getAccount(account).link}>
          <AccountInfo />
        </Link>
      ) : (
        <AccountInfo />
      )}
      <div className="flex items-center gap-3">
        <FollowUnfollowButton
          hideFollowButton={hideFollowButton}
          hideUnfollowButton={hideUnfollowButton}
          account={account}
          small
        />
        {menu}
      </div>
    </div>
  );
};

export default memo(SingleAccount);
