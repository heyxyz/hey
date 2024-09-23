import { ChartBarIcon } from "@heroicons/react/24/outline";
import cn from "@hey/ui/cn";
import Link from "next/link";
import type { FC } from "react";

interface AnalyticsProps {
  className?: string;
  onClick?: () => void;
}

const Analytics: FC<AnalyticsProps> = ({ className = "", onClick }) => {
  return (
    <Link
      className={cn(
        "flex w-full items-center space-x-1.5 px-2 py-1.5 text-gray-700 text-sm dark:text-gray-200",
        className
      )}
      href="/analytics"
      onClick={onClick}
    >
      <ChartBarIcon className="size-4" />
      <div>Analytics</div>
    </Link>
  );
};

export default Analytics;
