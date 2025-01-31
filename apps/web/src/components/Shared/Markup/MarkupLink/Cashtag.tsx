import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { MarkupLinkProps } from "@hey/types/misc";
import Link from "next/link";
import type { FC } from "react";
import urlcat from "urlcat";

const Cashtag: FC<MarkupLinkProps> = ({ title }) => {
  if (!title) {
    return null;
  }

  return (
    <Link
      className="outline-none focus:underline"
      href={urlcat("/search", {
        q: title,
        src: "link_click",
        type: "posts"
      })}
      onClick={stopEventPropagation}
    >
      {title}
    </Link>
  );
};

export default Cashtag;
