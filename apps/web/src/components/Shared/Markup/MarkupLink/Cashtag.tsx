import { Leafwatch } from "@helpers/leafwatch";
import { PUBLICATION } from "@hey/data/tracking";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { MarkupLinkProps } from "@hey/types/misc";
import Link from "next/link";
import type { FC } from "react";
import urlcat from "urlcat";

const Cashtag: FC<MarkupLinkProps> = ({ title }) => {
  if (!title) {
    return null;
  }

  const tag = title.slice(1).toLowerCase();

  return (
    <Link
      className="outline-none focus:underline"
      href={urlcat("/search", {
        q: title,
        src: "link_click",
        type: "pubs"
      })}
      onClick={(event) => {
        stopEventPropagation(event);
        Leafwatch.track(PUBLICATION.CLICK_CASHTAG, { cashtag: tag });
      }}
    >
      {title}
    </Link>
  );
};

export default Cashtag;
