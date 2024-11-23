import { AVATAR, PLACEHOLDER_IMAGE } from "@hey/data/constants";
import imageKit from "@hey/helpers/imageKit";
import sanitizeDStorageUrl from "@hey/helpers/sanitizeDStorageUrl";
import type { List } from "@hey/types/hey";
import { Image } from "@hey/ui";
import Link from "next/link";
import plur from "plur";
import type { FC } from "react";
import { memo } from "react";

interface SingleListProps {
  list: List;
  linkToList?: boolean;
}

const SingleList: FC<SingleListProps> = ({ list, linkToList = true }) => {
  const ListInfo = () => (
    <div className="flex items-center space-x-3">
      <Image
        alt={list.id}
        className="size-11 rounded-lg border bg-gray-200 dark:border-gray-700"
        height={44}
        loading="lazy"
        src={
          list.avatar
            ? imageKit(sanitizeDStorageUrl(list.avatar), AVATAR)
            : PLACEHOLDER_IMAGE
        }
        width={44}
      />
      <div className="flex flex-col">
        <div className="font-bold">{list.name}</div>
        <div className="text-gray-500 text-xs">
          {list.totalAccounts} {plur("Profile", list.totalAccounts)}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {linkToList ? (
        <Link href={`/lists/${list.id}`}>
          <ListInfo />
        </Link>
      ) : (
        <ListInfo />
      )}
    </>
  );
};

export default memo(SingleList);
