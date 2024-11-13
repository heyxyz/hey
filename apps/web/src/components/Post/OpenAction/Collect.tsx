import { Leafwatch } from "@helpers/leafwatch";
import hasOptimisticallyCollected from "@helpers/optimistic/hasOptimisticallyCollected";
import { FeatureFlag } from "@hey/data/feature-flags";
import { PUBLICATION } from "@hey/data/tracking";
import allowedOpenActionModules from "@hey/helpers/allowedOpenActionModules";
import type { MirrorablePublication } from "@hey/lens";
import { Button, Modal } from "@hey/ui";
import { useFlag } from "@unleash/proxy-client-react";
import type { FC } from "react";
import { useState } from "react";
import CollectModule from "./CollectModule";

interface CollectProps {
  post: MirrorablePublication;
}

const Collect: FC<CollectProps> = ({ post }) => {
  const enabled = useFlag(FeatureFlag.Collect);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const openActions = post.openActionModules.filter((module) =>
    allowedOpenActionModules.includes(module.type)
  );

  const hasActed =
    post.operations.hasActed.value || hasOptimisticallyCollected(post.id);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => {
          setShowCollectModal(true);
          Leafwatch.track(PUBLICATION.COLLECT_MODULE.OPEN_COLLECT, {
            publication_id: post.id,
            source: "button"
          });
        }}
        outline={!hasActed}
        size="sm"
      >
        {hasActed ? "Collected" : "Collect"}
      </Button>
      <Modal
        onClose={() => setShowCollectModal(false)}
        show={showCollectModal}
        title="Collect"
      >
        {openActions?.map((action) => (
          <CollectModule key={action.type} openAction={action} post={post} />
        ))}
      </Modal>
    </>
  );
};

export default Collect;
