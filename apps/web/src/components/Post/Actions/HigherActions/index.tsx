import type { Post } from "@hey/indexer";
import type { FC } from "react";
import GardenerActions from "./GardenerActions";

interface HigherActionsProps {
  post: Post;
}

const HigherActions: FC<HigherActionsProps> = ({ post }) => {
  return (
    <div className="m-5">
      <GardenerActions post={post} />
    </div>
  );
};

export default HigherActions;
