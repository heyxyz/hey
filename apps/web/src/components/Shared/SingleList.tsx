import { PLACEHOLDER_IMAGE } from "@hey/data/constants";
import type { List } from "@hey/types/hey";
import { Image } from "@hey/ui";
import type { FC } from "react";
import { memo } from "react";

interface SingleListProps {
  list: List;
}

const SingleList: FC<SingleListProps> = ({ list }) => {
  return (
    <div className="flex items-center space-x-3">
      <Image
        alt={list.id}
        className="size-11 rounded-lg border bg-gray-200 dark:border-gray-700"
        height={44}
        loading="lazy"
        src={list.avatar || PLACEHOLDER_IMAGE}
        width={44}
      />
      <div className="flex flex-col">
        <div className="font-bold">{list.name}</div>
        <div className="text-gray-500 text-xs">{list.count} Members</div>
      </div>
    </div>
  );
};

export default memo(SingleList);
