import FollowersYouKnowOverview from "@components/Account/FollowersYouKnowOverview";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import getMentions from "@hey/helpers/getMentions";
import nFormatter from "@hey/helpers/nFormatter";
import truncateByWords from "@hey/helpers/truncateByWords";
import { type AccountStats, useFullAccountLazyQuery } from "@hey/indexer";
import { Card, Image } from "@hey/ui";
import * as HoverCard from "@radix-ui/react-hover-card";
import plur from "plur";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import FollowUnfollowButton from "./Account/FollowUnfollowButton";
import Verified from "./Account/Icons/Verified";
import Markup from "./Markup";
import Slug from "./Slug";

const MINIMUM_LOADING_ANIMATION_MS = 800;

interface AccountPreviewProps {
  children: ReactNode;
  handle?: string;
  address?: string;
  showUserPreview?: boolean;
}

const AccountPreview: FC<AccountPreviewProps> = ({
  children,
  handle,
  address,
  showUserPreview = true
}) => {
  const [loadAccount, { data, loading }] = useFullAccountLazyQuery({
    fetchPolicy: "cache-and-network"
  });
  const [syntheticLoading, setSyntheticLoading] = useState<boolean>(loading);
  const account = data?.account;
  const stats = data?.accountStats as AccountStats;

  const onPreviewStart = async () => {
    if (account || loading) {
      return;
    }

    setSyntheticLoading(true);
    await loadAccount({
      variables: {
        accountRequest: {
          ...(address
            ? { address }
            : { username: { localName: handle as string } })
        },
        accountStatsRequest: { account: address }
      }
    });
    setTimeout(() => setSyntheticLoading(false), MINIMUM_LOADING_ANIMATION_MS);
  };

  if (!address && !handle) {
    return null;
  }

  if (!showUserPreview) {
    return <span>{children}</span>;
  }

  const Preview = () => {
    if (loading || syntheticLoading) {
      return (
        <div className="flex flex-col">
          <div className="horizontal-loader w-full">
            <div />
          </div>
          <div className="flex p-3">
            <div>{handle || `#${address}`}</div>
          </div>
        </div>
      );
    }

    if (!account) {
      return (
        <div className="flex h-12 items-center px-3">No account found</div>
      );
    }

    const UserAvatar: FC = () => (
      <Image
        alt={account.address}
        className="size-12 rounded-full border bg-gray-200 dark:border-gray-700"
        height={48}
        loading="lazy"
        src={getAvatar(account)}
        width={48}
      />
    );

    const UserName: FC = () => (
      <>
        <div className="flex max-w-sm items-center gap-1 truncate">
          <div className="text-md">{getAccount(account).name}</div>
          <Verified address={account.address} iconClassName="size-4" />
        </div>
        <span>
          <Slug
            className="text-sm"
            slug={getAccount(account).usernameWithPrefix}
          />
          {account.operations?.isFollowingMe && (
            <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs dark:bg-gray-700">
              Follows you
            </span>
          )}
        </span>
      </>
    );

    return (
      <>
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <UserAvatar />
            <FollowUnfollowButton account={account} small />
          </div>
          <UserName />
          {account.metadata?.bio && (
            <div className="linkify mt-2 break-words text-sm leading-6">
              <Markup mentions={getMentions(account.metadata.bio)}>
                {truncateByWords(account.metadata.bio, 20)}
              </Markup>
            </div>
          )}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <div className="text-base">
                {nFormatter(stats.graphFollowStats?.following)}
              </div>
              <div className="ld-text-gray-500 text-sm">Following</div>
            </div>
            <div className="flex items-center space-x-1 text-md">
              <div className="text-base">
                {nFormatter(stats.graphFollowStats?.followers)}
              </div>
              <div className="ld-text-gray-500 text-sm">
                {plur("Follower", stats.graphFollowStats?.followers)}
              </div>
            </div>
          </div>
          <div className="!text-xs">
            <FollowersYouKnowOverview
              handle={getAccount(account).username}
              address={account.address}
              viaPopover
            />
          </div>
        </div>
      </>
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

export default AccountPreview;
