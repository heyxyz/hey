import { Leafwatch } from "@helpers/leafwatch";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { PUBLICATION } from "@hey/data/tracking";
import allowedOpenActionModules from "@hey/helpers/allowedOpenActionModules";
import humanize from "@hey/helpers/humanize";
import nFormatter from "@hey/helpers/nFormatter";
import type { MirrorablePublication } from "@hey/lens";
import { Modal, Tooltip } from "@hey/ui";
import { motion } from "framer-motion";
import plur from "plur";
import { type FC, useState } from "react";
import CollectModule from "./CollectModule";

interface OpenActionProps {
  publication: MirrorablePublication;
}

const OpenAction: FC<OpenActionProps> = ({ publication }) => {
  const [showCollectModal, setShowCollectModal] = useState(false);
  const { countOpenActions } = publication.stats;
  const openActions = publication.openActionModules.filter((module) =>
    allowedOpenActionModules.includes(module.type)
  );

  return (
    <div className="ld-text-gray-500 flex items-center space-x-1">
      <motion.button
        aria-label="Collect"
        className="rounded-full p-1.5 outline-offset-2 hover:bg-gray-300/20"
        onClick={() => {
          setShowCollectModal(true);
          Leafwatch.track(PUBLICATION.COLLECT_MODULE.OPEN_COLLECT, {
            publication_id: publication.id,
            source: "icon"
          });
        }}
        whileTap={{ scale: 0.9 }}
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
      </motion.button>
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
          <CollectModule
            key={action.type}
            openAction={action}
            publication={publication}
          />
        ))}
      </Modal>
    </div>
  );
};

export default OpenAction;
