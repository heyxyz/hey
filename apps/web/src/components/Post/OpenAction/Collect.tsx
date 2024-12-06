import { Leafwatch } from "@helpers/leafwatch";
import { FeatureFlag } from "@hey/data/feature-flags";
import { POST } from "@hey/data/tracking";
import allowedPostActionModules from "@hey/helpers/allowedPostActionModules";
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
  const postActions = post.actions.filter((action) =>
    allowedPostActionModules.includes(action.__typename)
  );

  const hasActed =
    post.operations?.hasActed.value || hasOptimisticallyCollected(post.id);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => {
          setShowCollectModal(true);
          Leafwatch.track(POST.COLLECT_MODULE.OPEN_COLLECT, {
            postId: post.id,
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
        {postActions?.map((action) => (
          <CollectModule
            key={action.__typename}
            postAction={action}
            post={post}
          />
        ))}
      </Modal>
    </>
  );
};

export default Collect;
