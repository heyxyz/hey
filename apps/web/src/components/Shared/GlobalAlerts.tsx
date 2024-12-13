import GardenerActions from "@components/Post/Actions/HigherActions/GardenerActions";
import { Alert } from "@hey/ui";
import type { FC } from "react";
import { useGlobalAlertStateStore } from "src/store/non-persisted/useGlobalAlertStateStore";
import BlockOrUnblockAccount from "./Alert/BlockOrUnblockAccount";
import DeletePost from "./Alert/DeletePost";
import MuteOrUnmuteAccount from "./Alert/MuteOrUnmuteAccount";

const GlobalAlerts: FC = () => {
  const {
    blockingorUnblockingAccount,
    mutingOrUnmutingAccount,
    modingPost,
    setShowGardenerActionsAlert,
    showGardenerActionsAlert
  } = useGlobalAlertStateStore();

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
      {mutingOrUnmutingAccount && <MuteOrUnmuteAccount />}
    </>
  );
};

export default GlobalAlerts;
