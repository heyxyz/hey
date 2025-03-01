import getAvatar from "@hey/helpers/getAvatar";
import getMentions from "@hey/helpers/getMentions";
import type { GroupFragment } from "@hey/indexer";
import { Image } from "@hey/ui";
import cn from "@hey/ui/cn";
import Link from "next/link";
import type { FC } from "react";
import { memo } from "react";
import JoinLeaveButton from "./Group/JoinLeaveButton";
import Markup from "./Markup";

interface SingleGroupProps {
  hideJoinButton?: boolean;
  hideLeaveButton?: boolean;
  isBig?: boolean;
  linkToGroup?: boolean;
  showDescription?: boolean;
  group: GroupFragment;
}

const SingleGroup: FC<SingleGroupProps> = ({
  hideJoinButton = false,
  hideLeaveButton = false,
  isBig = false,
  linkToGroup = true,
  showDescription = false,
  group
}) => {
  const GroupAvatar: FC = () => (
    <Image
      alt={group.address}
      className={cn(
        isBig ? "size-14" : "size-11",
        "rounded-lg border bg-gray-200 dark:border-gray-700"
      )}
      height={isBig ? 56 : 44}
      loading="lazy"
      src={getAvatar(group)}
      width={isBig ? 56 : 44}
    />
  );

  const GroupInfo: FC = () => (
    <div className="mr-8 flex items-center space-x-3">
      <GroupAvatar />
      <div>
        <div className="truncate font-semibold">{group.metadata?.name}</div>
        {showDescription && group.metadata?.description && (
          <div
            className="linkify mt-2 text-base leading-6"
            style={{ wordBreak: "break-word" }}
          >
            <Markup mentions={getMentions(group.metadata.description)}>
              {group.metadata.description}
            </Markup>
          </div>
        )}
      </div>
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
