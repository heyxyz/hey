import Source from "@components/Post/Source";
import Misuse from "@components/Shared/Account/Icons/Misuse";
import Verified from "@components/Shared/Account/Icons/Verified";
import formatRelativeOrAbsolute from "@hey/helpers/datetime/formatRelativeOrAbsolute";
import getAccount from "@hey/helpers/getAccount";
import type { Account } from "@hey/indexer";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import { memo } from "react";
import AccountPreview from "../Shared/AccountPreview";
import Slug from "../Shared/Slug";
import ClubHandle from "./ClubHandle";

interface PostAccountProps {
  account: Account;
  postId: string;
  source?: string;
  tags: string[];
  timestamp: Date;
}

const PostAccount: FC<PostAccountProps> = ({
  account,
  postId,
  source,
  tags,
  timestamp
}) => {
  const WrappedLink = ({ children }: { children: ReactNode }) => (
    <Link
      className="outline-none hover:underline focus:underline"
      href={getAccount(account).link}
    >
      <AccountPreview
        handle={account.username?.value}
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
        <span className="font-semibold">{getAccount(account).displayName}</span>
      </WrappedLink>
      <WrappedLink>
        <Slug className="text-sm" slug={getAccount(account).slugWithPrefix} />
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
      <ClubHandle tags={tags} />
      <Source publishedOn={source} />
    </div>
  );
};

export default memo(PostAccount);
