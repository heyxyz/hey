import GroupPreview from "@components/Shared/GroupPreview";
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
      onClick={stopEventPropagation}
    >
      <GroupPreview handle={title}>{title}</GroupPreview>
    </Link>
  );
};

export default Group;
