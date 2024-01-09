import GardenerActions from '@components/Publication/Actions/GardenerActions';
import TrustedProfilesActions from '@components/Publication/Actions/TrustedProfilesActions';
import { type FC, useState } from 'react';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';

import TrustedReportDetails from './TrustedReportDetails';

interface ActionsProps {
  hideTrustedReport?: boolean;
  publicationId: string;
}

const Actions: FC<ActionsProps> = ({
  hideTrustedReport = false,
  publicationId
}) => {
  const [expanded, setExpanded] = useState(true);
  const trusted = useFeatureFlagsStore((state) => state.trusted);
  const gardenerMode = useFeatureFlagsStore((state) => state.gardenerMode);

  if (!expanded) {
    return null;
  }

  return (
    <div>
      {gardenerMode && (
        <>
          <div className="divider" />
          <div className="m-5 space-y-2">
            <b>Gardener actions</b>
            <GardenerActions
              ableToRemoveReport={hideTrustedReport}
              className="mt-3 max-w-md"
              publicationId={publicationId}
              setExpanded={setExpanded}
            />
          </div>
          {hideTrustedReport && (
            <TrustedReportDetails publicationId={publicationId} />
          )}
        </>
      )}
      {trusted && !hideTrustedReport && (
        <>
          <div className="divider" />
          <div className="m-5">
            <b>Moderate Post</b>
            <TrustedProfilesActions
              className="mt-3 max-w-md"
              publicationId={publicationId}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Actions;
