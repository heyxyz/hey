import Accounts from "@components/Shared/Accounts";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import type { Account } from "@hey/indexer";
import type { FC } from "react";

interface MirroredProps {
  account: Account;
}

const Mirrored: FC<MirroredProps> = ({ account }) => {
  return (
    <div className="ld-text-gray-500 mb-3 flex items-center space-x-1 text-[13px]">
      <ArrowsRightLeftIcon className="size-4" />
      <Accounts context="mirrored" accounts={[account]} />
    </div>
  );
};

export default Mirrored;
