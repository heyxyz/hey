import Markup from "@components/Shared/Markup";
import { PLACEHOLDER_IMAGE } from "@hey/data/constants";
import getMentions from "@hey/helpers/getMentions";
import humanize from "@hey/helpers/humanize";
import type { List } from "@hey/types/hey";
import { H3, H4, Image, LightBox } from "@hey/ui";
import Link from "next/link";
import type { FC } from "react";
import { useState } from "react";

interface DetailsProps {
  list: List;
}

const Details: FC<DetailsProps> = ({ list }) => {
  const [expandedImage, setExpandedImage] = useState<null | string>(null);

  return (
    <div className="mb-4 space-y-5 px-5 sm:px-0">
      <div className="size-32 sm:size-52">
        <Image
          alt={list.name}
          className="size-32 cursor-pointer rounded-xl bg-gray-200 ring-8 ring-gray-50 sm:size-52 dark:bg-gray-700 dark:ring-black"
          height={128}
          onClick={() => setExpandedImage(list.avatar)}
          src={list.avatar || PLACEHOLDER_IMAGE}
          width={128}
        />
        <LightBox onClose={() => setExpandedImage(null)} url={expandedImage} />
      </div>
      <H3 className="truncate py-2">{list.name}</H3>
      {list.description ? (
        <div className="markup linkify mr-0 break-words text-md sm:mr-10">
          <Markup mentions={getMentions(list.description)}>
            {list.description}
          </Markup>
        </div>
      ) : null}
      <div className="space-y-5">
        <Link
          className="text-left outline-offset-4"
          href={`/lists/${list.id}/profiles`}
        >
          <H4>{humanize(list.count)}</H4>
          <div className="ld-text-gray-500">Profiles</div>
        </Link>
      </div>
    </div>
  );
};

export default Details;
