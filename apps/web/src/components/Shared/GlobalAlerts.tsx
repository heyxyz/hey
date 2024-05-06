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

  return (
    <>
      <DeletePublication />
      {modingPublication ? (
        <Alert
          description="Perform mod actions on this publication."
          onClose={() => setShowGardenerActionsAlert(false, null)}
          show={showGardenerActionsAlert}
          title="Mod actions"
        >
          <GardenerActions publication={modingPublication} />
        </Alert>
      ) : null}
      {blockingorUnblockingProfile ? <BlockOrUnBlockProfile /> : null}
    </>
  );
};

export default GlobalAlerts;
