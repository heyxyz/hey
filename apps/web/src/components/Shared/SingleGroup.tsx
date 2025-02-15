import getAvatar from "@hey/helpers/getAvatar";
import type { Group } from "@hey/indexer";
import { Image } from "@hey/ui";
import Link from "next/link";
import type { FC } from "react";
import { memo } from "react";
import JoinLeaveButton from "./Group/JoinLeaveButton";

interface SingleGroupProps {
  hideJoinButton?: boolean;
  hideLeaveButton?: boolean;
  linkToGroup?: boolean;
  group: Group;
}

const SingleGroup: FC<SingleGroupProps> = ({
  hideJoinButton = false,
  hideLeaveButton = false,
  linkToGroup = true,
  group
}) => {
  const GroupAvatar: FC = () => (
    <Image
      alt={group.address}
      className="size-11 rounded-lg border bg-gray-200 dark:border-gray-700"
      height={44}
      loading="lazy"
      src={getAvatar(group)}
      width={44}
    />
  );

  const GroupInfo: FC = () => (
    <div className="mr-8 flex items-center space-x-3">
      <GroupAvatar />
      <div className="truncate font-semibold">{group.metadata?.name}</div>
    </div>
  );

  return (
    <div className="flex items-center justify-between">
      {linkToGroup ? (
        <Link href={`/g/${group.address}`}>
          <GroupInfo />
        </Link>
      ) : (
        <GroupInfo />
      )}
      <JoinLeaveButton
        hideJoinButton={hideJoinButton}
        hideLeaveButton={hideLeaveButton}
        group={group}
        small
      />
    </div>
  );
};

export default memo(SingleGroup);
