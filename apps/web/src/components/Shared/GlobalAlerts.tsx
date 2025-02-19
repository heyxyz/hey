import type { FC } from "react";
import { useBanAlertStateStore } from "src/store/non-persisted/alert/useBanAlertStateStore";
import { useBlockAlertStateStore } from "src/store/non-persisted/alert/useBlockAlertStateStore";
import { useMuteAlertStateStore } from "src/store/non-persisted/alert/useMuteAlertStateStore";
import BanOrUnbanAccount from "./Alert/BanOrUnbanAccount";
import BlockOrUnblockAccount from "./Alert/BlockOrUnblockAccount";
import DeletePost from "./Alert/DeletePost";
import MuteOrUnmuteAccount from "./Alert/MuteOrUnmuteAccount";

const GlobalAlerts: FC = () => {
  const { mutingOrUnmutingAccount } = useMuteAlertStateStore();
  const { banningOrUnbanningAccount } = useBanAlertStateStore();
  const { blockingorUnblockingAccount } = useBlockAlertStateStore();

  return (
    <>
      <DeletePost />
      {blockingorUnblockingAccount && <BlockOrUnblockAccount />}
      {banningOrUnbanningAccount && <BanOrUnbanAccount />}
      {mutingOrUnmutingAccount && <MuteOrUnmuteAccount />}
    </>
  );
};

export default GlobalAlerts;
