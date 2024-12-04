import GroupPreview from "@components/Shared/GroupPreview";
import Link from "next/link";
import type { FC } from "react";

interface GroupHandleProps {
  tags: string[];
}

const GroupHandle: FC<GroupHandleProps> = ({ tags }) => {
  const orbcommunities = tags.find((word) => word.includes("orbcommunities"));
  const group = orbcommunities?.replaceAll("orbcommunities", "");

  if (!group) {
    return null;
  }

  return (
    <span className="ld-text-gray-500 linkify">
      <span className="mr-1">·</span>
      <GroupPreview handle={group}>
        <Link className="text-xs hover:underline" href={`/g/${group}`}>
          /{group}
        </Link>
      </GroupPreview>
    </span>
  );
};

export default GroupHandle;
