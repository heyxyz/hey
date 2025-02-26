import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import { IS_MAINNET, IS_PRODUCTION } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import cn from "@hey/ui/cn";
import { useFlag } from "@unleash/proxy-client-react";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import Performance from "./Performance";

interface BadgeProps {
  children: ReactNode;
}

export const Badge: FC<BadgeProps> = ({ children }) => (
  <span className="rounded-md bg-gray-300 px-1.5 py-0.5 font-bold text-xs dark:bg-gray-600">
    {children}
  </span>
);

const StaffBar: FC = () => {
  const isStaff = useFlag(FeatureFlag.Staff);

  if (!isStaff) {
    return null;
  }

  return (
    <div className="flex items-center justify-between bg-gray-200 px-3 py-1 text-sm dark:bg-gray-800">
      <div className="mr-5 flex flex-wrap items-center gap-2">
        <Performance />
        <div className="flex items-center space-x-1">
          <GlobeAltIcon
            className={cn(
              IS_PRODUCTION ? "text-green-500" : "text-yellow-500",
              "size-4"
            )}
          />
          <Badge>
            {IS_PRODUCTION ? "prod" : "dev"}{" "}
            <span className="text-[10px]">
              ({IS_MAINNET ? "mainnet" : "testnet"})
            </span>
          </Badge>
        </div>
      </div>
      <Link
        aria-label="Staff Dashboard"
        className="flex items-center space-x-2"
        href="/staff"
      >
        <ShieldCheckIcon className="size-4 text-green-600" />
        <span className="hidden sm:block">Dashboard</span>
      </Link>
    </div>
  );
};

export default StaffBar;
