import type { FC } from 'react';

import GardenerActions from '@components/Publication/Actions/HigherActions/GardenerActions';
import { Alert } from '@hey/ui';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';

import BlockOrUnBlockProfile from './Alert/BlockOrUnBlockProfile';
import DeletePublication from './Alert/DeletePublication';

const GlobalAlerts: FC = () => {
  const {
    blockingorUnblockingProfile,
    modingPublication,
    setShowGardenerActionsAlert,
    showGardenerActionsAlert
  } = useGlobalAlertStateStore();

  const handleCloseGardenerActionsAlert = () => {
    setShowGardenerActionsAlert(false, null);
  };

  return (
    <>
      <DeletePublication />
      {modingPublication && (
        <Alert
          description="Perform mod actions on this publication."
          onClose={handleCloseGardenerActionsAlert}
          show={showGardenerActionsAlert}
          title="Mod actions"
        >
          <GardenerActions publication={modingPublication} />
        </Alert>
      )}
      {blockingorUnblockingProfile && <BlockOrUnBlockProfile />}
    </>
  );
};

export default GlobalAlerts;
