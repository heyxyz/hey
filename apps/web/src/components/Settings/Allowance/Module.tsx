import getAllowanceModule from "@helpers/getAllowanceModule";
import { POLYGONSCAN_URL } from "@hey/data/constants";
import type { ApprovedAllowanceAmountResult } from "@hey/lens";
import { Card } from "@hey/ui";
import Link from "next/link";
import type { FC } from "react";
import { useState } from "react";
import AllowanceButton from "./Button";

interface ModuleProps {
  module: ApprovedAllowanceAmountResult;
}

const Module: FC<ModuleProps> = ({ module }) => {
  const [allowed, setAllowed] = useState(
    Number.parseFloat(module?.allowance.value) > 0
  );

  return (
    <Card
      className="block items-center justify-between p-5 sm:flex"
      forceRounded
      key={module?.moduleName}
    >
      <div className="mr-1.5 mb-3 overflow-hidden sm:mb-0">
        <div className="whitespace-nowrap font-bold">
          {getAllowanceModule(module?.moduleName).name}
        </div>
        <Link
          className="ld-text-gray-500 truncate text-sm"
          href={`${POLYGONSCAN_URL}/address/${module?.moduleContract.address}`}
          rel="noreferrer noopener"
          target="_blank"
        >
          {module?.moduleContract.address}
        </Link>
      </div>
      <AllowanceButton
        allowed={allowed}
        module={module}
        setAllowed={setAllowed}
      />
    </Card>
  );
};

export default Module;
