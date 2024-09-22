import { SparklesIcon } from "@heroicons/react/24/outline";
import cn from "@hey/ui/cn";
import type { FC } from "react";

interface ProProps {
  className?: string;
}

const Pro: FC<ProProps> = ({ className = "" }) => {
  return (
    <div
      className={cn(
        "flex w-full items-center space-x-1.5 text-gray-700 text-sm dark:text-gray-200",
        className
      )}
    >
      <SparklesIcon className="size-4" />
      <div>Pro</div>
    </div>
  );
};

export default Pro;
