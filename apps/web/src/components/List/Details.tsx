import PinUnpinButton from "@components/Shared/List/PinUnpinButton";
import Markup from "@components/Shared/Markup";
import {
  AVATAR,
  EXPANDED_AVATAR,
  PLACEHOLDER_IMAGE
} from "@hey/data/constants";
import getMentions from "@hey/helpers/getMentions";
import humanize from "@hey/helpers/humanize";
import imageKit from "@hey/helpers/imageKit";
import sanitizeDStorageUrl from "@hey/helpers/sanitizeDStorageUrl";
import type { List } from "@hey/types/hey";
import { Card, H4, H5, Image, LightBox } from "@hey/ui";
import Link from "next/link";
import type { FC } from "react";
import { useState } from "react";

interface DetailsProps {
  list: List;
}

const Details: FC<DetailsProps> = ({ list }) => {
  const [expandedImage, setExpandedImage] = useState<null | string>(null);

  return (
    <Card as="aside" className="mb-4 space-y-5 p-5">
      <Image
        alt={list.name}
        className="size-24 rounded-lg border bg-gray-200 dark:border-gray-700"
        height={128}
        onClick={() =>
          setExpandedImage(
            list.avatar
              ? imageKit(sanitizeDStorageUrl(list.avatar), EXPANDED_AVATAR)
              : PLACEHOLDER_IMAGE
          )
        }
        src={
          list.avatar
            ? imageKit(sanitizeDStorageUrl(list.avatar), AVATAR)
            : PLACEHOLDER_IMAGE
        }
        width={128}
      />
      <LightBox onClose={() => setExpandedImage(null)} url={expandedImage} />
      <div className="space-y-1">
        <H5>{list.name}</H5>
        {list.description ? (
          <div className="markup linkify mr-0 break-words text-md">
            <Markup mentions={getMentions(list.description)}>
              {list.description}
            </Markup>
          </div>
        ) : null}
      </div>
      <div className="mt-5">
        <Link
          className="text-left outline-offset-4"
          href={`/lists/${list.id}/profiles`}
        >
          <H4>{humanize(list.count)}</H4>
          <div className="ld-text-gray-500">Profiles</div>
        </Link>
      </div>
      <PinUnpinButton list={list} />
    </Card>
  );
};

export default Details;
