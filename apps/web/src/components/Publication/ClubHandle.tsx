import type { FC } from "react";

import ClubPreview from "@components/Shared/ClubPreview";
import Link from "next/link";

interface ClubHandleProps {
  tags: string[];
}

const ClubHandle: FC<ClubHandleProps> = ({ tags }) => {
  const orbcommunities = tags.find((word) => word.includes("orbcommunities"));
  const club = orbcommunities?.replaceAll("orbcommunities", "");

  if (!club) {
    return null;
  }

  return (
    <span className="ld-text-gray-500 linkify truncate">
      <span className="mx-1">·</span>
      <ClubPreview handle={club}>
        <Link className="text-xs hover:underline" href={`/c/${club}`}>
          /{club}
        </Link>
      </ClubPreview>
    </span>
  );
};

export default ClubHandle;
