import GardenerActions from "@components/Publication/Actions/HigherActions/GardenerActions";
import { Alert } from "@hey/ui";
import type { FC } from "react";
import { useGlobalAlertStateStore } from "src/store/non-persisted/useGlobalAlertStateStore";
import BlockOrUnBlockProfile from "./Alert/BlockOrUnBlockProfile";
import DeletePublication from "./Alert/DeletePublication";

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
      <DeletePublication />
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
      {blockingorUnblockingProfile && <BlockOrUnBlockProfile />}
    </>
  );
};

export default GlobalAlerts;
