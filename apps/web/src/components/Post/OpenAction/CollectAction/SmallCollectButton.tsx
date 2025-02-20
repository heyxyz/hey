import { FeatureFlag } from "@hey/data/feature-flags";
import type { Post } from "@hey/indexer";
import { Button, Modal } from "@hey/ui";
import { useFlag } from "@unleash/proxy-client-react";
import type { FC } from "react";
import { useState } from "react";
import CollectActionBody from "./CollectActionBody";

interface SmallCollectButtonProps {
  post: Post;
}

const SmallCollectButton: FC<SmallCollectButtonProps> = ({ post }) => {
  const enabled = useFlag(FeatureFlag.Collect);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const hasSimpleCollected = post.operations?.hasSimpleCollected;

  if (!enabled) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setShowCollectModal(true)}
        outline={!hasSimpleCollected}
        size="sm"
      >
        {hasSimpleCollected ? "Collected" : "Collect"}
      </Button>
      <Modal
        onClose={() => setShowCollectModal(false)}
        show={showCollectModal}
        title="Collect"
      >
        <CollectActionBody post={post} />
      </Modal>
    </>
  );
};

export default SmallCollectButton;
