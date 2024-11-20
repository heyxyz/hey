import MenuTransition from "@components/Shared/MenuTransition";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { MirrorablePublication } from "@hey/lens";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { Fragment } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import Bookmark from "./Bookmark";
import CopyID from "./CopyID";
import CopyPostText from "./CopyPostText";
import Delete from "./Delete";
import HideComment from "./HideComment";
import NotInterested from "./NotInterested";
import Report from "./Report";
import Share from "./Share";

interface PostMenuProps {
  post: MirrorablePublication;
}

const PostMenu: FC<PostMenuProps> = ({ post }) => {
  const { currentAccount } = useAccountStore();
  const iconClassName = "w-[15px] sm:w-[18px]";

  return (
    <Menu as="div" className="relative">
      <MenuButton as={Fragment}>
        <button
          aria-label="More"
          className="rounded-full p-1.5 hover:bg-gray-300/20"
          onClick={stopEventPropagation}
          type="button"
        >
          <EllipsisHorizontalIcon
            className={cn("ld-text-gray-500", iconClassName)}
          />
        </button>
      </MenuButton>
      <MenuTransition>
        <MenuItems
          className="absolute right-0 z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          static
        >
          {currentAccount ? (
            <>
              <NotInterested post={post} />
              <HideComment post={post} />
              <Bookmark post={post} />
            </>
          ) : null}
          <div className="divider" />
          <Share post={post} />
          <CopyPostText post={post} />
          <CopyID id={post.id} />
          <div className="divider" />
          {currentAccount?.id === post?.by?.id ? (
            <Delete post={post} />
          ) : (
            <Report post={post} />
          )}
        </MenuItems>
      </MenuTransition>
    </Menu>
  );
};

export default PostMenu;
