import Accounts from "@components/Shared/Accounts";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import type { Post } from "@hey/indexer";
import type { FC } from "react";

interface MirroredProps {
  reposts: Post[];
}

const Mirrored: FC<MirroredProps> = ({ reposts }) => {
  const getMirroredAccounts = () => {
    let accounts = reposts.map((repost) => repost.author);
    accounts = accounts.filter(
      (account, index, self) =>
        index === self.findIndex((t) => t.address === account.address)
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
