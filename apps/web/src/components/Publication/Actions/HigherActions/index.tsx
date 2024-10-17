import type { MirrorablePublication } from "@hey/lens";
import type { FC } from "react";
import AIModeration from "./AIModeration";
import GardenerActions from "./GardenerActions";

interface HigherActionsProps {
  publication: MirrorablePublication;
}

const HigherActions: FC<HigherActionsProps> = ({ publication }) => {
  return (
    <>
      <div className="m-5">
        <GardenerActions publication={publication} />
      </div>
      <AIModeration id={publication.id} />
    </>
  );
};

export default HigherActions;
