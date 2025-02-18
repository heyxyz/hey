import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import humanize from "@hey/helpers/humanize";
import nFormatter from "@hey/helpers/nFormatter";
import { isRepost } from "@hey/helpers/postHelpers";
import type { AnyPost } from "@hey/indexer";
import { Modal, Tooltip } from "@hey/ui";
import plur from "plur";
import { type FC, useState } from "react";
import CollectAction from "./CollectAction";

interface OpenActionProps {
  post: AnyPost;
}

const OpenAction: FC<OpenActionProps> = ({ post }) => {
  const targetPost = isRepost(post) ? post.repostOf : post;
  const [showCollectModal, setShowCollectModal] = useState(false);
  const { countOpenActions } = targetPost.stats;

  return (
    <div className="ld-text-gray-500 flex items-center space-x-1">
      <button
        aria-label="Collect"
        className="rounded-full p-1.5 outline-offset-2 hover:bg-gray-300/20"
        onClick={() => setShowCollectModal(true)}
        type="button"
      >
        <Tooltip
          content={`${humanize(countOpenActions)} ${plur(
            "Collect",
            countOpenActions
          )}`}
          placement="top"
          withDelay
        >
          <ShoppingBagIcon className="w-[15px] sm:w-[18px]" />
        </Tooltip>
      </button>
      {countOpenActions > 0 ? (
        <span className="text-[11px] sm:text-xs">
          {nFormatter(countOpenActions)}
        </span>
      ) : null}
      <Modal
        onClose={() => setShowCollectModal(false)}
        show={showCollectModal}
        title="Collect"
      >
        <CollectAction post={post} />
      </Modal>
    </div>
  );
};

export default OpenAction;
