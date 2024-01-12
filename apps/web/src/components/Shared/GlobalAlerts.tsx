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
  const modingPublicationId = useGlobalAlertStateStore(
    (state) => state.modingPublicationId
  );
  const blockingorUnblockingProfile = useGlobalAlertStateStore(
    (state) => state.blockingorUnblockingProfile
  );

  return (
    <>
      <DeletePublication />
      {modingPublicationId ? (
        <Alert
          description="Perform mod actions on this publication."
          onClose={() => setShowGardenerActionsAlert(false, null)}
          show={showGardenerActionsAlert}
          title="Mod actions"
        >
          <GardenerActions publicationId={modingPublicationId} />
        </Alert>
      ) : null}
      {blockingorUnblockingProfile ? <BlockOrUnBlockProfile /> : null}
    </>
  );
};

export default GlobalAlerts;
