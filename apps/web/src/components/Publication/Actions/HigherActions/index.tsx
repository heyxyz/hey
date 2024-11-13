import type { MirrorablePublication } from "@hey/lens";
import type { FC } from "react";
import GardenerActions from "./GardenerActions";

interface HigherActionsProps {
  post: MirrorablePublication;
}

const HigherActions: FC<HigherActionsProps> = ({ post }) => {
  return (
    <div className="m-5">
      <GardenerActions post={post} />
    </div>
  );
};

export default HigherActions;
