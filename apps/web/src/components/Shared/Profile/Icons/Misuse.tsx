import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import getMisuseDetails from "@hey/helpers/getMisuseDetails";
import hasMisused from "@hey/helpers/hasMisused";
import { Tooltip } from "@hey/ui";
import cn from "@hey/ui/cn";
import type { FC } from "react";

interface VerifiedProps {
  id: string;
  showTooltip?: boolean;
  iconClassName?: string;
}

const Misuse: FC<VerifiedProps> = ({
  id,
  showTooltip = false,
  iconClassName = ""
}) => {
  const misuseDetails = getMisuseDetails(id);

  if (!hasMisused(id)) {
    return null;
  }

  if (!showTooltip) {
    return (
      <ExclamationCircleIcon
        className={cn("size-6 text-pink-500", iconClassName)}
      />
    );
  }

  return (
    <Tooltip content={misuseDetails?.type}>
      <ExclamationCircleIcon
        className={cn("size-6 text-pink-500", iconClassName)}
      />
    </Tooltip>
  );
};

export default Misuse;
