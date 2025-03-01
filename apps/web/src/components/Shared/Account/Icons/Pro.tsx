import { SparklesIcon } from "@heroicons/react/24/solid";
import type { AccountFragment } from "@hey/indexer";
import { Tooltip } from "@hey/ui";
import cn from "@hey/ui/cn";
import type { FC } from "react";

interface ProProps {
  account: AccountFragment;
  showTooltip?: boolean;
  iconClassName?: string;
}

const Pro: FC<ProProps> = ({
  account,
  showTooltip = false,
  iconClassName = ""
}) => {
  if (!account.pro) {
    return null;
  }

  if (!showTooltip) {
    return (
      <SparklesIcon className={cn("size-6 text-brand-500", iconClassName)} />
    );
  }

  return (
    <Tooltip content="Pro">
      <SparklesIcon className={cn("size-6 text-brand-500", iconClassName)} />
    </Tooltip>
  );
};

export default Pro;
