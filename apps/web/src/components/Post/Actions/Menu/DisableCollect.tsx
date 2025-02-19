import { MenuItem } from "@headlessui/react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import type { Post } from "@hey/indexer";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { useDisableCollectAlertStateStore } from "src/store/non-persisted/alert/useDisableCollectAlertStateStore";

interface DisableCollectProps {
  post: Post;
}

const DisableCollect: FC<DisableCollectProps> = ({ post }) => {
  const { setShowDisableCollectAlert } = useDisableCollectAlertStateStore();
  const enabled = post.actions.some(
    (action) => action.__typename === "SimpleCollectAction"
  );

  if (!enabled) {
    return null;
  }

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { "dropdown-active": focus },
          "m-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm"
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        setShowDisableCollectAlert(true, post);
      }}
    >
      <div className="flex items-center space-x-2">
        <ShoppingBagIcon className="size-4" />
        <div>Disable Collect</div>
      </div>
    </MenuItem>
  );
};

export default DisableCollect;
