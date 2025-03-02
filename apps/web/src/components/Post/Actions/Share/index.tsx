import MenuTransition from "@components/Shared/MenuTransition";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import humanize from "@hey/helpers/humanize";
import nFormatter from "@hey/helpers/nFormatter";
import { isRepost } from "@hey/helpers/postHelpers";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { AnyPostFragment } from "@hey/indexer";
import { Spinner, Tooltip } from "@hey/ui";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { useState } from "react";
import Quote from "./Quote";
import Repost from "./Repost";
import UndoRepost from "./UndoRepost";

interface ShareMenuProps {
  post: AnyPostFragment;
  showCount: boolean;
}

const ShareMenu: FC<ShareMenuProps> = ({ post, showCount }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const targetPost = isRepost(post) ? post?.repostOf : post;
  const hasReposted =
    targetPost.operations?.hasReposted.optimistic ||
    targetPost.operations?.hasReposted.onChain;
  const hasQuoted =
    targetPost.operations?.hasQuoted.optimistic ||
    targetPost.operations?.hasQuoted.onChain;
  const hasShared = hasReposted || hasQuoted;
  const shares = targetPost.stats.reposts + targetPost.stats.quotes;

  const canRepost =
    targetPost.operations?.canRepost.__typename ===
    "PostOperationValidationPassed";
  const canQuote =
    targetPost.operations?.canQuote.__typename ===
    "PostOperationValidationPassed";

  const iconClassName = "w-[15px] sm:w-[18px]";

  if (!canRepost && !canQuote) {
    return null;
  }

  return (
    <div className="flex items-center space-x-1">
      <Menu as="div" className="relative">
        <MenuButton
          aria-label="Repost"
          className={cn(
            hasShared
              ? "text-brand-500 hover:bg-brand-300/20"
              : "ld-text-gray-500 hover:bg-gray-300/20",
            "rounded-full p-1.5 outline-offset-2"
          )}
          onClick={stopEventPropagation}
        >
          {isSubmitting ? (
            <Spinner
              className="mr-0.5"
              size="xs"
              variant={hasShared ? "danger" : "primary"}
            />
          ) : (
            <Tooltip
              content={
                shares > 0
                  ? `${humanize(shares)} Reposts and Quotes`
                  : "Repost or Quote"
              }
              placement="top"
              withDelay
            >
              <ArrowsRightLeftIcon className={iconClassName} />
            </Tooltip>
          )}
        </MenuButton>
        <MenuTransition>
          <MenuItems
            className="absolute z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
            static
          >
            {canRepost && (
              <Repost
                isSubmitting={isSubmitting}
                post={targetPost}
                setIsSubmitting={setIsSubmitting}
              />
            )}
            {hasReposted && targetPost.id !== post.id && (
              <UndoRepost
                post={post}
                isSubmitting={isSubmitting}
                setIsSubmitting={setIsSubmitting}
              />
            )}
            {canQuote && <Quote post={targetPost} />}
          </MenuItems>
        </MenuTransition>
      </Menu>
      {shares > 0 && !showCount ? (
        <span
          className={cn(
            hasShared ? "text-brand-500" : "ld-text-gray-500",
            "text-[11px] sm:text-xs"
          )}
        >
          {nFormatter(shares)}
        </span>
      ) : null}
    </div>
  );
};

export default ShareMenu;
