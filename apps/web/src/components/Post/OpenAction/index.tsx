import { Leafwatch } from "@helpers/leafwatch";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { POST } from "@hey/data/tracking";
import allowedOpenActionModules from "@hey/helpers/allowedOpenActionModules";
import humanize from "@hey/helpers/humanize";
import nFormatter from "@hey/helpers/nFormatter";
import type { MirrorablePublication } from "@hey/lens";
import { Modal, Tooltip } from "@hey/ui";
import plur from "plur";
import { type FC, useState } from "react";
import CollectModule from "./CollectModule";

interface OpenActionProps {
  post: MirrorablePublication;
}

const OpenAction: FC<OpenActionProps> = ({ post }) => {
  const [showCollectModal, setShowCollectModal] = useState(false);
  const { countOpenActions } = post.stats;
  const openActions = post.openActionModules.filter((module) =>
    allowedOpenActionModules.includes(module.type)
  );

  return (
    <div className="ld-text-gray-500 flex items-center space-x-1">
      <button
        aria-label="Collect"
        className="rounded-full p-1.5 outline-offset-2 hover:bg-gray-300/20"
        onClick={() => {
          setShowCollectModal(true);
          Leafwatch.track(POST.COLLECT_MODULE.OPEN_COLLECT, {
            postId: post.id,
            source: "icon"
          });
        }}
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
        {openActions?.map((action) => (
          <CollectModule key={action.type} openAction={action} post={post} />
        ))}
      </Modal>
    </div>
  );
};

export default OpenAction;
