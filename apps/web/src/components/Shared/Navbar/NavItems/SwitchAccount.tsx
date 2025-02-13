import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { useGlobalModalStateStore } from "src/store/non-persisted/useGlobalModalStateStore";

interface SwitchAccountProps {
  className?: string;
}

const SwitchAccount: FC<SwitchAccountProps> = ({ className = "" }) => {
  const { setShowAccountSwitchModal } = useGlobalModalStateStore();

  return (
    <button
      className={cn(
        "flex w-full items-center space-x-2 px-2 py-1.5 text-left text-gray-700 text-sm focus:outline-none dark:text-gray-200",
        className
      )}
      onClick={() => setShowAccountSwitchModal(true)}
      type="button"
    >
      <ArrowsRightLeftIcon className="size-4" />
      <span>Switch account</span>
    </button>
  );
};

export default SwitchAccount;
