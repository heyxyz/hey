import getAccount from "@hey/helpers/getAccount";
import type { AccountFragment } from "@hey/indexer";
import cn from "@hey/ui/cn";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import Slug from "./Slug";

interface FallbackAccountNameProps {
  className?: string;
  account?: AccountFragment;
  separator?: ReactNode;
}

const FallbackAccountName: FC<FallbackAccountNameProps> = ({
  className = "",
  account,
  separator = ""
}) => {
  if (!account) {
    return null;
  }

  const { name, link, usernameWithPrefix } = getAccount(account);
  const accountName = account?.metadata?.name || (
    <Slug slug={usernameWithPrefix} />
  );

  return (
    <>
      <Link
        aria-label={`Account of ${name || usernameWithPrefix}`}
        className={cn(
          "max-w-sm truncate outline-none hover:underline focus:underline",
          className
        )}
        href={link}
      >
        <b className="whitespace-nowrap">{accountName}</b>
      </Link>
      {separator && <span>{separator}</span>}
    </>
  );
};

export default FallbackAccountName;
