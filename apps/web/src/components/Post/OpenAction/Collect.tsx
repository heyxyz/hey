import { FeatureFlag } from "@hey/data/feature-flags";
import type { Post } from "@hey/indexer";
import { Button, Modal } from "@hey/ui";
import { useFlag } from "@unleash/proxy-client-react";
import type { FC } from "react";
import { useState } from "react";
import { useTransactionStore } from "src/store/persisted/useTransactionStore";
import CollectModule from "./CollectModule";

interface CollectProps {
  post: Post;
}

const Collect: FC<CollectProps> = ({ post }) => {
  const enabled = useFlag(FeatureFlag.Collect);
  const { hasOptimisticallyCollected } = useTransactionStore();
  const [showCollectModal, setShowCollectModal] = useState(false);
  const postActions = post.actions.find((action) =>
    action.__typename === "SimpleCollectAction"
  );

  const hasActed =
    post.operations?.hasReacted || hasOptimisticallyCollected(post.id);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setShowCollectModal(true)}
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
        <CollectModule post={post} />
      </Modal>
    </>
  );
};

export default Collect;
