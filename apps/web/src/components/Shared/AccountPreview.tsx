import MutualFollowersOverview from "@components/Account/MutualFollowersOverview";
import getAccountDetails, {
  GET_ACCOUNT_DETAILS_QUERY_KEY
} from "@hey/helpers/api/getAccountDetails";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import getLennyURL from "@hey/helpers/getLennyURL";
import getMentions from "@hey/helpers/getMentions";
import nFormatter from "@hey/helpers/nFormatter";
import truncateByWords from "@hey/helpers/truncateByWords";
import type { Profile } from "@hey/lens";
import { useProfileLazyQuery } from "@hey/lens";
import { Card, Image } from "@hey/ui";
import * as HoverCard from "@radix-ui/react-hover-card";
import { useQuery } from "@tanstack/react-query";
import plur from "plur";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import Markup from "./Markup";
import FollowUnfollowButton from "./Profile/FollowUnfollowButton";
import Misuse from "./Profile/Icons/Misuse";
import Verified from "./Profile/Icons/Verified";
import Slug from "./Slug";

const MINIMUM_LOADING_ANIMATION_MS = 800;

interface AccountPreviewProps {
  children: ReactNode;
  handle?: string;
  id?: string;
  showUserPreview?: boolean;
}

const AccountPreview: FC<AccountPreviewProps> = ({
  children,
  handle,
  id,
  showUserPreview = true
}) => {
  const [loadProfile, { data, loading: networkLoading }] = useProfileLazyQuery({
    fetchPolicy: "cache-and-network"
  });
  const [syntheticLoading, setSyntheticLoading] =
    useState<boolean>(networkLoading);
  const account = data?.profile as Profile;

  const onPreviewStart = async () => {
    if (account || networkLoading) {
      return;
    }

    setSyntheticLoading(true);
    await loadProfile({
      variables: {
        request: { ...(id ? { forProfileId: id } : { forHandle: handle }) }
      }
    });
    setTimeout(() => setSyntheticLoading(false), MINIMUM_LOADING_ANIMATION_MS);
  };

  if (!id && !handle) {
    return null;
  }

  if (!showUserPreview) {
    return <span>{children}</span>;
  }

  const Preview = () => {
    if (networkLoading || syntheticLoading) {
      return (
        <div className="flex flex-col">
          <div className="horizontal-loader w-full">
            <div />
          </div>
          <div className="flex p-3">
            <div>{handle || `#${id}`}</div>
          </div>
        </div>
      );
    }

    if (!account) {
      return (
        <div className="flex h-12 items-center px-3">No profile found</div>
      );
    }

    const AccountStatus: FC = () => {
      const { data: accountDetails } = useQuery({
        enabled: Boolean(id),
        queryFn: () => getAccountDetails(id as string),
        queryKey: [GET_ACCOUNT_DETAILS_QUERY_KEY, id]
      });

      if (!accountDetails?.status) {
        return null;
      }

      return (
        <div>
          <div className="rounded-t-xl bg-yellow-50 px-4 py-2">
            <span>{accountDetails.status.emoji}</span>
            <b className="ml-2 text-sm">{accountDetails.status.message}</b>
          </div>
          <div className="divider" />
        </div>
      );
    };

    const UserAvatar: FC = () => (
      <Image
        alt={account.id}
        className="size-12 rounded-full border bg-gray-200 dark:border-gray-700"
        height={48}
        loading="lazy"
        onError={({ currentTarget }) => {
          currentTarget.src = getLennyURL(account.id);
        }}
        src={getAvatar(account)}
        width={48}
      />
    );

    const UserName: FC = () => (
      <>
        <div className="flex max-w-sm items-center gap-1 truncate">
          <div className="text-md">{getAccount(account).displayName}</div>
          <Verified id={account.id} iconClassName="size-4" />
          <Misuse id={account.id} iconClassName="size-4" />
        </div>
        <span>
          <Slug className="text-sm" slug={getAccount(account).slugWithPrefix} />
          {account.operations.isFollowingMe.value && (
            <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs dark:bg-gray-700">
              Follows you
            </span>
          )}
        </span>
      </>
    );

    return (
      <>
        <AccountStatus />
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
                {nFormatter(account.stats.following)}
              </div>
              <div className="ld-text-gray-500 text-sm">Following</div>
            </div>
            <div className="flex items-center space-x-1 text-md">
              <div className="text-base">
                {nFormatter(account.stats.followers)}
              </div>
              <div className="ld-text-gray-500 text-sm">
                {plur("Follower", account.stats.followers)}
              </div>
            </div>
          </div>
          <div className="!text-xs">
            <MutualFollowersOverview
              handle={getAccount(account).slug}
              accountId={account.id}
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
