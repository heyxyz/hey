import type { ApprovedModuleAllowanceAmountQuery } from "@hey/lens";
import type { FC } from "react";
import Module from "./Module";

interface AllowanceProps {
  allowance: ApprovedModuleAllowanceAmountQuery | undefined;
}

const Allowance: FC<AllowanceProps> = ({ allowance }) => {
  return (
    <div className="mt-5 space-y-4">
      {allowance?.approvedModuleAllowanceAmount?.map((item) => (
        <Module key={item?.moduleContract.address} module={item} />
      ))}
    </div>
  );
};

export default Allowance;
