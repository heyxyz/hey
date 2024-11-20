import { HeyLensSignup } from "@hey/abis";
import { HEY_LENS_SIGNUP } from "@hey/data/constants";
import { NumberedStat } from "@hey/ui";
import type { FC } from "react";
import { useReadContract } from "wagmi";

const AccountsCreated: FC = () => {
  const { data: totalProfilesCreated } = useReadContract({
    abi: HeyLensSignup,
    address: HEY_LENS_SIGNUP,
    functionName: "totalProfilesCreated",
    query: { refetchInterval: 2000 }
  });

  return (
    <NumberedStat
      count={totalProfilesCreated?.toString() || "0"}
      name="Total Profiles"
      suffix="Profiles"
    />
  );
};

export default AccountsCreated;
