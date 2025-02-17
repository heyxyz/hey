import { UserGroupIcon } from "@heroicons/react/24/outline";
import cn from "@hey/ui/cn";
import Link from "next/link";
import type { FC } from "react";

interface GroupsProps {
  className?: string;
  onClick?: () => void;
}

const Groups: FC<GroupsProps> = ({ className = "", onClick }) => {
  return (
    <Link
      className={cn(
        "flex w-full items-center space-x-1.5 px-2 py-1.5 text-gray-700 text-sm dark:text-gray-200",
        className
      )}
      href="/groups"
      onClick={onClick}
    >
      <UserGroupIcon className="size-4" />
      <div>Groups</div>
    </Link>
  );
};

export default Groups;
