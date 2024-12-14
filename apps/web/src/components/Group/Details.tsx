import JoinLeaveButton from "@components/Shared/Group/JoinLeaveButton";
import Markup from "@components/Shared/Markup";
import getMentions from "@hey/helpers/getMentions";
import humanize from "@hey/helpers/humanize";
import type { Group, GroupStatsResponse } from "@hey/indexer";
import { H3, H4, Image, LightBox } from "@hey/ui";
import Link from "next/link";
import plur from "plur";
import type { FC } from "react";
import { useState } from "react";

interface DetailsProps {
  group: Group;
  stats: GroupStatsResponse;
}

const Details: FC<DetailsProps> = ({ group, stats }) => {
  const [expandedImage, setExpandedImage] = useState<null | string>(null);

  return (
    <div className="mb-4 space-y-5 px-5 sm:px-0">
      <div className="-mt-24 sm:-mt-32 relative size-32 sm:size-52">
        <Image
          alt={group.address}
          className="size-32 cursor-pointer rounded-xl bg-gray-200 ring-8 ring-gray-50 sm:size-52 dark:bg-gray-700 dark:ring-black"
          height={128}
          onClick={() => setExpandedImage(group.metadata?.icon)}
          src={group.metadata?.icon}
          width={128}
        />
        <LightBox onClose={() => setExpandedImage(null)} url={expandedImage} />
      </div>
      <H3 className="truncate py-2">{group.metadata?.name}</H3>
      {group.metadata?.description ? (
        <div className="markup linkify mr-0 break-words text-md sm:mr-10">
          <Markup mentions={getMentions(group.metadata?.description)}>
            {group.metadata?.description}
          </Markup>
        </div>
      ) : null}
      <div className="space-y-5">
        <Link
          className="text-left outline-offset-4"
          href={`/g/${group.address}/members`}
        >
          <H4>{humanize(stats.totalMembers)}</H4>
          <div className="ld-text-gray-500">
            {plur("Member", stats.totalMembers)}
          </div>
        </Link>
        <JoinLeaveButton group={group} />
      </div>
    </div>
  );
};

export default Details;
