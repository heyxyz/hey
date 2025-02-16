import GardenerActions from "@components/Post/Actions/HigherActions/GardenerActions";
import { Alert } from "@hey/ui";
import type { FC } from "react";
import { useBanAlertStateStore } from "src/store/non-persisted/useBanAlertStateStore";
import { useBlockAlertStateStore } from "src/store/non-persisted/useBlockAlertStateStore";
import { useGlobalAlertStateStore } from "src/store/non-persisted/useGlobalAlertStateStore";
import BanOrUnbanAccount from "./Alert/BanOrUnbanAccount";
import BlockOrUnblockAccount from "./Alert/BlockOrUnblockAccount";
import DeletePost from "./Alert/DeletePost";
import MuteOrUnmuteAccount from "./Alert/MuteOrUnmuteAccount";

const GlobalAlerts: FC = () => {
  const {
    mutingOrUnmutingAccount,
    modingPost,
    setShowGardenerActionsAlert,
    showGardenerActionsAlert
  } = useGlobalAlertStateStore();
  const { banningOrUnbanningAccount } = useBanAlertStateStore();
  const { blockingorUnblockingAccount } = useBlockAlertStateStore();

  const handleCloseGardenerActionsAlert = () => {
    setShowGardenerActionsAlert(false, null);
  };

  return (
    <>
      <DeletePost />
      {modingPost && (
        <Alert
          description="Perform mod actions on this publication."
          onClose={handleCloseGardenerActionsAlert}
          show={showGardenerActionsAlert}
          title="Mod actions"
        >
          <GardenerActions post={modingPost} />
        </Alert>
      )}
      {blockingorUnblockingAccount && <BlockOrUnblockAccount />}
      {banningOrUnbanningAccount && <BanOrUnbanAccount />}
      {mutingOrUnmutingAccount && <MuteOrUnmuteAccount />}
    </>
  );
};

export default GlobalAlerts;
