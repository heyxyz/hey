import { UserIcon } from "@heroicons/react/24/outline";
import cn from "@hey/ui/cn";
import type { FC } from "react";

interface YourAccountProps {
  className?: string;
}

const YourAccount: FC<YourAccountProps> = ({ className = "" }) => {
  return (
    <div
      className={cn(
        "flex w-full items-center space-x-1.5 text-gray-700 text-sm dark:text-gray-200",
        className
      )}
    >
      <UserIcon className="size-4" />
      <div>Your profile</div>
    </div>
  );
};

export default YourAccount;
