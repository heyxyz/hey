import getMentions from "@hey/helpers/getMentions";
import nFormatter from "@hey/helpers/nFormatter";
import truncateByWords from "@hey/helpers/truncateByWords";
import { type Group, useGroupLazyQuery } from "@hey/indexer";
import { Card, Image } from "@hey/ui";
import * as HoverCard from "@radix-ui/react-hover-card";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import JoinLeaveButton from "./Group/JoinLeaveButton";
import Markup from "./Markup";
import Slug from "./Slug";

const MINIMUM_LOADING_ANIMATION_MS = 800;

interface GroupPreviewProps {
  children: ReactNode;
  handle?: string;
}

const GroupPreview: FC<GroupPreviewProps> = ({ children, handle }) => {
  const [loadGroup, { data, loading }] = useGroupLazyQuery({
    variables: { request: { group: handle } }
  });

  const [syntheticLoading, setSyntheticLoading] = useState<boolean>(loading);
  const group = data?.group;

  const onPreviewStart = async () => {
    if (group || loading) {
      return;
    }

    setSyntheticLoading(true);
    await loadGroup();
    setTimeout(() => setSyntheticLoading(false), MINIMUM_LOADING_ANIMATION_MS);
  };

  if (!handle) {
    return null;
  }

  const Preview = () => {
    if (loading || syntheticLoading) {
      return (
        <div className="flex flex-col">
          <div className="horizontal-loader w-full">
            <div />
          </div>
          <div className="flex p-3">
            <div>/{handle}</div>
          </div>
        </div>
      );
    }

    if (!group) {
      return <div className="flex h-12 items-center px-3">No group found</div>;
    }

    const UserAvatar: FC = () => (
      <Image
        alt={group.address}
        className="size-12 rounded-xl border bg-gray-200 dark:border-gray-700"
        height={48}
        loading="lazy"
        src={group.metadata?.icon}
        width={48}
      />
    );

    const UserName: FC = () => (
      <>
        <div className="text-md">{group.metadata?.name}</div>
        <Slug className="text-sm" slug={`/${group.metadata?.slug}`} />
      </>
    );

    return (
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <UserAvatar />
          <JoinLeaveButton group={group as Group} small />
        </div>
        <UserName />
        {group.metadata?.description && (
          <div className="linkify mt-2 break-words text-sm leading-6">
            <Markup mentions={getMentions(group.metadata?.description)}>
              {truncateByWords(group.metadata?.description, 20)}
            </Markup>
          </div>
        )}
        <div className="flex items-center space-x-1">
          <div className="text-base">{nFormatter(group.totalMembers)}</div>
          <div className="ld-text-gray-500 text-sm">Members</div>
        </div>
      </div>
    );
  };

  return (
    <span onFocus={onPreviewStart} onMouseOver={onPreviewStart}>
      <HoverCard.Root>
        <HoverCard.Trigger asChild>
          <span>{children}</span>
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content
            asChild
            className="z-10 w-72"
            side="bottom"
            sideOffset={5}
          >
            <div>
              <Card forceRounded>
                <Preview />
              </Card>
            </div>
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </span>
  );
};

export default GroupPreview;
