import type { FC } from 'react';

import ModAction from '@components/Publication/Actions/ModAction';
import { Alert } from '@hey/ui';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';

import BlockOrUnBlockProfile from './Alert/BlockOrUnBlockProfile';
import DeletePublication from './Alert/DeletePublication';

const GlobalAlerts: FC = () => {
  const showModActionAlert = useGlobalAlertStateStore(
    (state) => state.showModActionAlert
  );
  const setShowModActionAlert = useGlobalAlertStateStore(
    (state) => state.setShowModActionAlert
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
          onClose={() => setShowModActionAlert(false, null)}
          show={showModActionAlert}
          title="Mod actions"
        >
          <ModAction publicationId={modingPublicationId} />
        </Alert>
      ) : null}
      {blockingorUnblockingProfile ? <BlockOrUnBlockProfile /> : null}
    </>
  );
};

export default GlobalAlerts;
