import { ListBulletIcon } from "@heroicons/react/24/outline";
import cn from "@hey/ui/cn";
import Link from "next/link";
import type { FC } from "react";

interface ListsProps {
  className?: string;
  onClick?: () => void;
}

const Lists: FC<ListsProps> = ({ className = "", onClick }) => {
  return (
    <Link
      className={cn(
        "flex w-full items-center space-x-1.5 px-2 py-1.5 text-gray-700 text-sm dark:text-gray-200",
        className
      )}
      href="/lists"
      onClick={onClick}
    >
      <ListBulletIcon className="size-4" />
      <div>Lists</div>
    </Link>
  );
};

export default Lists;
