import Suspend from "@components/Shared/Account/Suspend";
import type { AccountFragment } from "@hey/indexer";
import type { FC } from "react";

interface StaffToolProps {
  account: AccountFragment;
}

const StaffTool: FC<StaffToolProps> = ({ account }) => {
  return (
    <div className="space-y-2.5">
      <div className="font-bold">Staff Tool</div>
      <div className="space-y-2 pt-2 font-bold">
        <Suspend address={account.address} />
      </div>
    </div>
  );
};

export default StaffTool;
