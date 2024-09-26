import ProfilePreview from "@components/Shared/ProfilePreview";
import Slug from "@components/Shared/Slug";
import { Leafwatch } from "@helpers/leafwatch";
import { PUBLICATION } from "@hey/data/tracking";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { MarkupLinkProps } from "@hey/types/misc";
import Link from "next/link";
import type { FC } from "react";

const Mention: FC<MarkupLinkProps> = ({ mentions, title }) => {
  const handle = title?.slice(1);

  if (!handle) {
    return null;
  }

  const fullHandles = mentions?.map(
    (mention) => mention.snapshotHandleMentioned.fullHandle
  );

  if (!fullHandles?.includes(handle)) {
    return title;
  }

  const canShowUserPreview = (handle: string) => {
    const foundMention = mentions?.find(
      (mention) => mention.snapshotHandleMentioned.fullHandle === handle
    );

    return Boolean(foundMention?.snapshotHandleMentioned.linkedTo?.nftTokenId);
  };

  const getLocalNameFromFullHandle = (handle: string) => {
    const foundMention = mentions?.find(
      (mention) => mention.snapshotHandleMentioned.fullHandle === handle
    );
    return foundMention?.snapshotHandleMentioned.localName;
  };

  return canShowUserPreview(handle) ? (
    <Link
      className="outline-none focus:underline"
      href={`/u/${getLocalNameFromFullHandle(handle)}`}
      onClick={(event) => {
        stopEventPropagation(event);
        Leafwatch.track(PUBLICATION.CLICK_MENTION, {
          handle: getLocalNameFromFullHandle(handle)
        });
      }}
    >
      <ProfilePreview handle={handle}>
        <Slug
          prefix="@"
          slug={getLocalNameFromFullHandle(handle)}
          useBrandColor
        />
      </ProfilePreview>
    </Link>
  ) : (
    <Slug prefix="@" slug={getLocalNameFromFullHandle(handle)} useBrandColor />
  );
};

export default Mention;
