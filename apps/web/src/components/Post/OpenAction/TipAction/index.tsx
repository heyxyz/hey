import MenuTransition from "@components/Shared/MenuTransition";
import { TipIcon } from "@components/Shared/TipIcon";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { Post } from "@hey/indexer";
import { Tooltip } from "@hey/ui";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import Action from "./Action";

interface TipActionProps {
  post: Post;
  showCount: boolean;
}

const TipAction: FC<TipActionProps> = ({ post, showCount }) => {
  const hasTipped = post.operations?.hasTipped;

  const iconClassName = showCount
    ? "w-[17px] sm:w-[20px]"
    : "w-[15px] sm:w-[18px]";

  return (
    <div className="ld-text-gray-500">
      <Menu as="div" className="relative">
        <MenuButton
          aria-label="Tip"
          className={cn(
            hasTipped
              ? "text-brand-500 hover:bg-brand-300/20"
              : "ld-text-gray-500 hover:bg-gray-300/20",
            "rounded-full p-1.5 outline-offset-2"
          )}
          onClick={stopEventPropagation}
        >
          <Tooltip content="Tip" placement="top" withDelay>
            <TipIcon
              className={cn({ "text-brand-500": hasTipped }, iconClassName)}
            />
          </Tooltip>
        </MenuButton>
        <MenuTransition>
          <MenuItems
            className="absolute z-[5] mt-1 w-max rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
            static
          >
            <MenuItem>
              {({ close }) => <Action closePopover={close} post={post} />}
            </MenuItem>
          </MenuItems>
        </MenuTransition>
      </Menu>
    </div>
  );
};

export default TipAction;
