import ModAction from '@components/Publication/Actions/ModAction';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import { useGlobalAlertStateStore } from 'src/store/alerts';
import { Alert } from 'ui/Alert';

import DeletePublication from './Alert/DeletePublication';

const GlobalAlerts: FC = () => {
  const showModActionAlert = useGlobalAlertStateStore((state) => state.showModActionAlert);
  const modingPublication = useGlobalAlertStateStore((state) => state.modingPublication);
  const setShowModActionAlert = useGlobalAlertStateStore((state) => state.setShowModActionAlert);

  return (
    <>
      <DeletePublication />
      {modingPublication ? (
        <Alert
          show={showModActionAlert}
          title={t`Mod actions`}
          description={t`Perform mod actions on this publication.`}
          onClose={() => setShowModActionAlert(false, null)}
        >
          <ModAction publication={modingPublication} />
        </Alert>
      ) : null}
    </>
  );
};

export default GlobalAlerts;
