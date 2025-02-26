import type { FC } from "react";
import { useBanAlertStore } from "src/store/non-persisted/alert/useBanAlertStore";
import { useBlockAlertStore } from "src/store/non-persisted/alert/useBlockAlertStore";
import { useMuteAlertStore } from "src/store/non-persisted/alert/useMuteAlertStore";
import BanOrUnbanAccount from "./Alert/BanOrUnbanAccount";
import BlockOrUnblockAccount from "./Alert/BlockOrUnblockAccount";
import DeletePost from "./Alert/DeletePost";
import MuteOrUnmuteAccount from "./Alert/MuteOrUnmuteAccount";

const GlobalAlerts: FC = () => {
  const { mutingOrUnmutingAccount } = useMuteAlertStore();
  const { banningOrUnbanningAccount } = useBanAlertStore();
  const { blockingorUnblockingAccount } = useBlockAlertStore();

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
