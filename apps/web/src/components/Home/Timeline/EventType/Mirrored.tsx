import Accounts from "@components/Shared/Accounts";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import type { Mirror } from "@hey/lens";
import type { FC } from "react";

interface MirroredProps {
  mirrors: Mirror[];
}

const Mirrored: FC<MirroredProps> = ({ mirrors }) => {
  const getMirroredAccounts = () => {
    let accounts = mirrors.map((mirror) => mirror.by);
    accounts = accounts.filter(
      (account, index, self) =>
        index === self.findIndex((t) => t.id === account.id)
    );
    return accounts;
  };

  return (
    <div className="ld-text-gray-500 mb-3 flex items-center space-x-1 text-[13px]">
      <ArrowsRightLeftIcon className="size-4" />
      <Accounts context="mirrored" accounts={getMirroredAccounts()} />
    </div>
  );
};

export default Mirrored;
