import GardenerActions from "@components/Post/Actions/HigherActions/GardenerActions";
import { Alert } from "@hey/ui";
import type { FC } from "react";
import { useGlobalAlertStateStore } from "src/store/non-persisted/useGlobalAlertStateStore";
import BlockOrUnBlockAccount from "./Alert/BlockOrUnBlockAccount";
import DeletePost from "./Alert/DeletePost";

const GlobalAlerts: FC = () => {
  const {
    blockingorUnblockingProfile,
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
      {blockingorUnblockingProfile && <BlockOrUnBlockAccount />}
    </>
  );
};

export default GlobalAlerts;
