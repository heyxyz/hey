import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import humanize from "@hey/helpers/humanize";
import nFormatter from "@hey/helpers/nFormatter";
import type { PostFragment } from "@hey/indexer";
import { Modal, Tooltip } from "@hey/ui";
import plur from "plur";
import { type FC, useState } from "react";
import CollectActionBody from "./CollectActionBody";

interface CollectActionProps {
  post: PostFragment;
}

const CollectAction: FC<CollectActionProps> = ({ post }) => {
  const [showCollectModal, setShowCollectModal] = useState(false);
  const { collects } = post.stats;

  return (
    <div className="ld-text-gray-500 flex items-center space-x-1">
      <button
        aria-label="Collect"
        className="rounded-full p-1.5 outline-offset-2 hover:bg-gray-300/20"
        onClick={() => setShowCollectModal(true)}
        type="button"
      >
        <Tooltip
          content={`${humanize(collects)} ${plur("Collect", collects)}`}
          placement="top"
          withDelay
        >
          <ShoppingBagIcon className="w-[15px] sm:w-[18px]" />
        </Tooltip>
      </button>
      {collects > 0 ? (
        <span className="text-[11px] sm:text-xs">{nFormatter(collects)}</span>
      ) : null}
      <Modal
        onClose={() => setShowCollectModal(false)}
        show={showCollectModal}
        title="Collect"
      >
        <CollectActionBody post={post} />
      </Modal>
    </div>
  );
};

export default CollectAction;
