import getAccount from "@hey/helpers/getAccount";
import type { Profile } from "@hey/lens";
import cn from "@hey/ui/cn";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import Slug from "./Slug";

interface FallbackAccountNameProps {
  className?: string;
  account?: Profile;
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

  const { displayName, link, slugWithPrefix } = getAccount(account);
  const accountName = account?.metadata?.displayName || (
    <Slug slug={slugWithPrefix} />
  );

  return (
    <>
      <Link
        aria-label={`Profile of ${displayName || slugWithPrefix}`}
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
