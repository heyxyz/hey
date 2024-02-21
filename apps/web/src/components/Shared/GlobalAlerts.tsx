import type { FC } from 'react';

import GardenerActions from '@components/Publication/Actions/GardenerActions';
import { Alert } from '@hey/ui';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';

import BlockOrUnBlockProfile from './Alert/BlockOrUnBlockProfile';
import DeletePublication from './Alert/DeletePublication';

const GlobalAlerts: FC = () => {
  const showGardenerActionsAlert = useGlobalAlertStateStore(
    (state) => state.showGardenerActionsAlert
  );
  const setShowGardenerActionsAlert = useGlobalAlertStateStore(
    (state) => state.setShowGardenerActionsAlert
  );
  const modingPublication = useGlobalAlertStateStore(
    (state) => state.modingPublication
  );
  const blockingorUnblockingProfile = useGlobalAlertStateStore(
    (state) => state.blockingorUnblockingProfile
  );

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
