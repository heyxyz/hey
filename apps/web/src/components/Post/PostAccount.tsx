import Verified from "@components/Shared/Account/Icons/Verified";
import formatRelativeOrAbsolute from "@hey/helpers/datetime/formatRelativeOrAbsolute";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import type { AccountFieldsFragment, PostGroupInfo } from "@hey/indexer";
import { Image } from "@hey/ui";
import Link from "next/link";
import { useRouter } from "next/router";
import type { FC, ReactNode } from "react";
import { memo } from "react";
import AccountPreview from "../Shared/AccountPreview";
import Slug from "../Shared/Slug";

interface PostAccountProps {
  account: AccountFieldsFragment;
  group?: PostGroupInfo;
  postSlug: string;
  timestamp: Date;
}

const PostAccount: FC<PostAccountProps> = ({
  account,
  group,
  postSlug,
  timestamp
}) => {
  const { pathname } = useRouter();

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
    <div className="flex flex-col">
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
        {timestamp ? (
          <span className="ld-text-gray-500">
            <span className="mr-1">·</span>
            <Link
              className="text-xs hover:underline"
              href={`/posts/${postSlug}`}
            >
              {formatRelativeOrAbsolute(timestamp)}
            </Link>
          </span>
        ) : null}
      </div>
      {group?.metadata && pathname !== "/g/[address]" ? (
        <Link
          className="mt-0.5 mb-2 flex w-fit max-w-sm items-center gap-x-1 text-xs hover:underline focus:underline"
          href={`/g/${group.address}`}
        >
          <Image
            src={getAvatar(group)}
            alt={group.metadata.name}
            className="size-4 rounded"
          />
          <span className="ld-text-gray-500 truncate">
            {group.metadata.name}
          </span>
        </Link>
      ) : null}
    </div>
  );
};

export default memo(PostAccount);
