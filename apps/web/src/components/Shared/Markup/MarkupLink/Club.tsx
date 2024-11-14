import ClubPreview from "@components/Shared/ClubPreview";
import { Leafwatch } from "@helpers/leafwatch";
import { CLUB_HANDLE_PREFIX } from "@hey/data/constants";
import { POST } from "@hey/data/tracking";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { MarkupLinkProps } from "@hey/types/misc";
import Link from "next/link";
import type { FC } from "react";

const Club: FC<MarkupLinkProps> = ({ title }) => {
  if (!title) {
    return null;
  }

  const club = title.slice(1).replace(CLUB_HANDLE_PREFIX, "").toLowerCase();
  const clubHandle = `/${club}`;

  return (
    <Link
      className="cursor-pointer outline-none focus:underline"
      href={`/c/${club}`}
      onClick={(event) => {
        stopEventPropagation(event);
        Leafwatch.track(POST.CLICK_CLUB, { club: clubHandle });
      }}
    >
      <ClubPreview handle={club}>{clubHandle}</ClubPreview>
    </Link>
  );
};

export default Club;
