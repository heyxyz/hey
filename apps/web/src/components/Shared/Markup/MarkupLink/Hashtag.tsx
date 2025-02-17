import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { MarkupLinkProps } from "@hey/types/misc";
import Link from "next/link";
import type { FC } from "react";
import urlcat from "urlcat";

const Hashtag: FC<MarkupLinkProps> = ({ title }) => {
  if (!title) {
    return null;
  }

  return (
    <span className="inline-flex items-center space-x-1">
      <span>
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
      </span>
    </span>
  );
};

export default Hashtag;
