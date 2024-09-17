import type { Club } from "@hey/types/club";
import type { FC, ReactNode } from "react";

import getClub from "@hey/helpers/api/clubs/getClub";
import getMentions from "@hey/helpers/getMentions";
import nFormatter from "@hey/helpers/nFormatter";
import truncateByWords from "@hey/helpers/truncateByWords";
import { Card, Image } from "@hey/ui";
import * as HoverCard from "@radix-ui/react-hover-card";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useProfileStore } from "src/store/persisted/useProfileStore";

import JoinLeaveButton from "./Club/JoinLeaveButton";
import Markup from "./Markup";
import Slug from "./Slug";

const MINIMUM_LOADING_ANIMATION_MS = 800;

interface ClubPreviewProps {
  children: ReactNode;
  handle?: string;
}

const ClubPreview: FC<ClubPreviewProps> = ({ children, handle }) => {
  const { currentProfile } = useProfileStore();

  const {
    data,
    isPending: clubLoading,
    mutateAsync
  } = useMutation({
    mutationFn: () =>
      getClub({ club_handle: handle, profile_id: currentProfile?.id }),
    mutationKey: ["getClub", handle]
  });

  const [syntheticLoading, setSyntheticLoading] =
    useState<boolean>(clubLoading);
  const club = data as Club;

  const onPreviewStart = async () => {
    if (club || clubLoading) {
      return;
    }

    setSyntheticLoading(true);
    await mutateAsync();
    setTimeout(() => setSyntheticLoading(false), MINIMUM_LOADING_ANIMATION_MS);
  };

  if (!handle) {
    return null;
  }

  const Preview = () => {
    if (clubLoading || syntheticLoading) {
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

    if (!club) {
      return <div className="flex h-12 items-center px-3">No club found</div>;
    }

    const UserAvatar: FC = () => (
      <Image
        alt={club.id}
        className="size-12 rounded-xl border bg-gray-200 dark:border-gray-700"
        height={48}
        loading="lazy"
        src={club.logo}
        width={48}
      />
    );

    const UserName: FC = () => (
      <>
        <div className="text-md">{club.name}</div>
        <Slug className="text-sm" slug={`/${club.handle}`} />
      </>
    );

    return (
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <UserAvatar />
          <JoinLeaveButton club={club} small />
        </div>
        <UserName />
        {club.description && (
          <div className="linkify mt-2 break-words text-sm leading-6">
            <Markup mentions={getMentions(club.description)}>
              {truncateByWords(club.description, 20)}
            </Markup>
          </div>
        )}
        <div className="flex items-center space-x-1">
          <div className="text-base">{nFormatter(club.totalMembers)}</div>
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

export default ClubPreview;
