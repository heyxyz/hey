import ModAction from '@components/Publication/Actions/ModAction';
import { Alert } from '@hey/ui';
import type { FC } from 'react';
import { useGlobalAlertStateStore } from 'src/store/alerts';

import BlockOrUnBlockProfile from './Alert/BlockOrUnBlockProfile';
import DeletePublication from './Alert/DeletePublication';

const GlobalAlerts: FC = () => {
  const {
    showModActionAlert,
    setShowModActionAlert,
    modingPublication,
    blockingProfile
  } = useGlobalAlertStateStore();

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
      {blockingProfile ? <BlockOrUnBlockProfile /> : null}
    </>
  );
};

export default GlobalAlerts;
