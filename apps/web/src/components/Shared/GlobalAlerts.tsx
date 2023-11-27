import ModAction from '@components/Publication/Actions/ModAction';
import { Alert } from '@hey/ui';
import type { FC } from 'react';
import { useGlobalAlertStateStore } from '@store/non-persisted/useGlobalAlertStateStore';

import BlockOrUnBlockProfile from './Alert/BlockOrUnBlockProfile';
import DeletePublication from './Alert/DeletePublication';

const GlobalAlerts: FC = () => {
  const showModActionAlert = useGlobalAlertStateStore(
    (state) => state.showModActionAlert
  );
  const setShowModActionAlert = useGlobalAlertStateStore(
    (state) => state.setShowModActionAlert
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
          show={showModActionAlert}
          title="Mod actions"
          description="Perform mod actions on this publication."
          onClose={() => setShowModActionAlert(false, null)}
        >
          <ModAction publication={modingPublication} />
        </Alert>
      ) : null}
      {blockingorUnblockingProfile ? <BlockOrUnBlockProfile /> : null}
    </>
  );
};

export default GlobalAlerts;
