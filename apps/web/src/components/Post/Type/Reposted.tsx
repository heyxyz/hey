import Accounts from "@components/Shared/Accounts";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import type { AccountFragment } from "@hey/indexer";
import type { FC } from "react";

interface RepostedProps {
  account: AccountFragment;
}

const Reposted: FC<RepostedProps> = ({ account }) => {
  return (
    <div className="ld-text-gray-500 mb-3 flex items-center space-x-1 text-[13px]">
      <ArrowsRightLeftIcon className="size-4" />
      <Accounts context="reposted" accounts={[account]} />
    </div>
  );
};

export default Reposted;
