import Source from "@components/Post/Source";
import Misuse from "@components/Shared/Account/Icons/Misuse";
import Verified from "@components/Shared/Account/Icons/Verified";
import formatRelativeOrAbsolute from "@hey/helpers/datetime/formatRelativeOrAbsolute";
import getAccount from "@hey/helpers/getAccount";
import type { Account, App, Maybe } from "@hey/indexer";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import { memo } from "react";
import AccountPreview from "../Shared/AccountPreview";
import Slug from "../Shared/Slug";

interface PostAccountProps {
  account: Account;
  postId: string;
  app?: Maybe<App>;
  timestamp: Date;
}

const PostAccount: FC<PostAccountProps> = ({
  account,
  postId,
  app,
  timestamp
}) => {
  const WrappedLink = ({ children }: { children: ReactNode }) => (
    <Link
      className="outline-none hover:underline focus:underline"
      href={getAccount(account).link}
    >
      <AccountPreview
        handle={account.username?.localName}
        address={account.address}
        showUserPreview
      >
        {children}
      </AccountPreview>
    </Link>
  );

  return (
    <div className="flex flex-wrap items-center gap-x-1">
      <WrappedLink>
        <span className="font-semibold">{getAccount(account).name}</span>
      </WrappedLink>
      <WrappedLink>
        <Slug
          className="text-sm"
          slug={getAccount(account).usernameWithPrefix}
        />
      </WrappedLink>
      <Verified address={account.address} iconClassName="size-4" />
      <Misuse address={account.address} iconClassName="size-4" />
      {timestamp ? (
        <span className="ld-text-gray-500">
          <span className="mr-1">·</span>
          <Link className="text-xs hover:underline" href={`/posts/${postId}`}>
            {formatRelativeOrAbsolute(timestamp)}
          </Link>
        </span>
      ) : null}
      {app ? <Source app={app} /> : null}
    </div>
  );
};

export default memo(PostAccount);
