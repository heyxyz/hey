import AccountPreview from "@components/Shared/AccountPreview";
import Slug from "@components/Shared/Slug";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { MarkupLinkProps } from "@hey/types/misc";
import Link from "next/link";
import type { FC } from "react";

const Mention: FC<MarkupLinkProps> = ({ mentions, title }) => {
  const handle = title;

  if (!handle) {
    return null;
  }

  const fullHandles = mentions?.map((mention) => mention.replace.from);

  if (!fullHandles?.includes(handle)) {
    return title;
  }

  const canShowUserPreview = (handle: string) => {
    const foundMention = mentions?.find(
      (mention) => mention.replace.from === handle
    );

    return Boolean(foundMention?.replace);
  };

  const getNameFromMention = (handle: string): string => {
    const foundMention = mentions?.find(
      (mention) => mention.replace.from === handle
    );

    return foundMention?.replace.from.split("/")[1] || "";
  };

  const getAddressFromMention = (handle: string): string => {
    const foundMention = mentions?.find(
      (mention) => mention.replace.from === handle
    );

    return foundMention?.__typename === "AccountMention"
      ? foundMention.account
      : "";
  };

  return canShowUserPreview(handle) ? (
    <Link
      className="outline-none focus:underline"
      href={`/u/${getNameFromMention(handle)}`}
      onClick={stopEventPropagation}
    >
      <AccountPreview
        handle={getNameFromMention(handle)}
        address={getAddressFromMention(handle)}
      >
        <Slug prefix="@" slug={getNameFromMention(handle)} useBrandColor />
      </AccountPreview>
    </Link>
  ) : (
    <Slug prefix="@" slug={getNameFromMention(handle)} useBrandColor />
  );
};

export default Mention;
