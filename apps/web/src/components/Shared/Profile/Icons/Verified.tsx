import isVerified from "@helpers/isVerified";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "@hey/ui";
import cn from "@hey/ui/cn";
import type { FC } from "react";

interface VerifiedProps {
  id: string;
  showTooltip?: boolean;
  iconClassName?: string;
}

const Verified: FC<VerifiedProps> = ({
  id,
  showTooltip = false,
  iconClassName = ""
}) => {
  if (!isVerified(id)) {
    return null;
  }

  if (!showTooltip) {
    return (
      <CheckBadgeIcon className={cn("size-6 text-brand-500", iconClassName)} />
    );
  }

  return (
    <Tooltip content="Verified">
      <CheckBadgeIcon className={cn("size-6 text-brand-500", iconClassName)} />
    </Tooltip>
  );
};

export default Verified;
