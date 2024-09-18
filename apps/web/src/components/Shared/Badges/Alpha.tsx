import { PuzzlePieceIcon } from "@heroicons/react/24/outline";
import { Badge } from "@hey/ui";
import type { FC } from "react";

const Alpha: FC = () => {
  return (
    <Badge className="flex items-center space-x-1" variant="danger">
      <PuzzlePieceIcon className="size-3" />
      <span>Alpha 🤫</span>
    </Badge>
  );
};

export default Alpha;
