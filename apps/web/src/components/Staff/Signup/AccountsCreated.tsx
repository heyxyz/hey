import { NumberedStat } from "@hey/ui";
import type { FC } from "react";

const AccountsCreated: FC = () => {
  return <NumberedStat count={"0"} name="Total Profiles" suffix="Profiles" />;
};

export default AccountsCreated;
