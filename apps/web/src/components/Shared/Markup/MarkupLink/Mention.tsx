import AccountPreview from "@components/Shared/AccountPreview";
import Slug from "@components/Shared/Slug";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { MarkupLinkProps } from "@hey/types/misc";
import Link from "next/link";
import type { FC } from "react";

const Mention: FC<MarkupLinkProps> = ({ mentions, title }) => {
  const handle = title?.slice(1);

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

    return Boolean(foundMention?.account);
  };

  const getLocalNameFromFullHandle = (handle: string) => {
    const foundMention = mentions?.find(
      (mention) => mention.replace.from === handle
    );
    return foundMention?.replace.from;
  };

  return canShowUserPreview(handle) ? (
    <Link
      className="outline-none focus:underline"
      href={`/u/${getLocalNameFromFullHandle(handle)}`}
      onClick={stopEventPropagation}
    >
      <AccountPreview handle={handle}>
        <Slug
          prefix="@"
          slug={getLocalNameFromFullHandle(handle)}
          useBrandColor
        />
      </AccountPreview>
    </Link>
  ) : (
    <Slug prefix="@" slug={getLocalNameFromFullHandle(handle)} useBrandColor />
  );
};

export default Mention;
