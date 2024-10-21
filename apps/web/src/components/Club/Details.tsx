import JoinLeaveButton from "@components/Shared/Club/JoinLeaveButton";
import Markup from "@components/Shared/Markup";
import Slug from "@components/Shared/Slug";
import getMentions from "@hey/helpers/getMentions";
import humanize from "@hey/helpers/humanize";
import type { Club } from "@hey/types/club";
import { H3, H4, Image, LightBox } from "@hey/ui";
import Link from "next/link";
import type { FC } from "react";
import { useState } from "react";

interface DetailsProps {
  club: Club;
}

const Details: FC<DetailsProps> = ({ club }) => {
  const [expandedImage, setExpandedImage] = useState<null | string>(null);

  return (
    <div className="mb-4 space-y-5 px-5 sm:px-0">
      <div className="-mt-24 sm:-mt-32 relative size-32 sm:size-52">
        <Image
          alt={club.handle}
          className="size-32 cursor-pointer rounded-xl bg-gray-200 ring-8 ring-gray-50 sm:size-52 dark:bg-gray-700 dark:ring-black"
          height={128}
          onClick={() => setExpandedImage(club.logo)}
          src={club.logo}
          width={128}
        />
        <LightBox onClose={() => setExpandedImage(null)} url={expandedImage} />
      </div>
      <div className="space-y-1 py-2">
        <H3 className="truncate">{club.name}</H3>
        <Slug className="text-sm sm:text-base" prefix="/" slug={club.handle} />
      </div>
      {club.description ? (
        <div className="markup linkify mr-0 break-words text-md sm:mr-10">
          <Markup mentions={getMentions(club.description)}>
            {club.description}
          </Markup>
        </div>
      ) : null}
      <div className="space-y-5">
        <Link
          className="text-left outline-offset-4"
          href={`/c/${club.handle}/members`}
        >
          <H4>{humanize(club.totalMembers)}</H4>
          <div className="ld-text-gray-500">Members</div>
        </Link>
        <JoinLeaveButton club={club} />
      </div>
    </div>
  );
};

export default Details;
