import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import cn from "@hey/ui/cn";
import type { FC } from "react";

interface SettingsProps {
  className?: string;
}

const Settings: FC<SettingsProps> = ({ className = "" }) => {
  return (
    <div
      className={cn(
        "flex w-full items-center space-x-1.5 text-gray-700 text-sm dark:text-gray-200",
        className
      )}
    >
      <Cog6ToothIcon className="size-4" />
      <div>Settings</div>
    </div>
  );
};

export default Settings;
