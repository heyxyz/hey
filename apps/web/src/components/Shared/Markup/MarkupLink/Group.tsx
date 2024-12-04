import GroupPreview from "@components/Shared/GroupPreview";
import { Leafwatch } from "@helpers/leafwatch";
import { POST } from "@hey/data/tracking";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { MarkupLinkProps } from "@hey/types/misc";
import Link from "next/link";
import type { FC } from "react";

const Group: FC<MarkupLinkProps> = ({ title }) => {
  if (!title) {
    return null;
  }

  return (
    <Link
      className="cursor-pointer outline-none focus:underline"
      href={`/g/${title}`}
      onClick={(event) => {
        stopEventPropagation(event);
        Leafwatch.track(POST.CLICK_GROUP, { group: title });
      }}
    >
      <GroupPreview handle={title}>{title}</GroupPreview>
    </Link>
  );
};

export default Group;
