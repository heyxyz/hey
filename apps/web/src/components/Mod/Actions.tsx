import GardenerActions from '@components/Publication/Actions/GardenerActions';
import TrustedProfilesActions from '@components/Publication/Actions/TrustedProfilesActions';
import { ModFeedType } from '@hey/data/enums';
import { type FC, useState } from 'react';
import { useFeatureFlagsStore } from 'src/store/persisted/useFeatureFlagsStore';

import ReportDetails from './ReportDetails';

interface ActionsProps {
  publicationId: string;
  type?: ModFeedType.REPORTS | ModFeedType.TRUSTED_REPORTS;
}

const Actions: FC<ActionsProps> = ({ publicationId, type }) => {
  const [expanded, setExpanded] = useState(true);
  const trusted = useFeatureFlagsStore((state) => state.trusted);
  const gardenerMode = useFeatureFlagsStore((state) => state.gardenerMode);

  const isTrustedReport = type === ModFeedType.TRUSTED_REPORTS;
  const isNormalReport = type === ModFeedType.REPORTS;

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
              className="mt-3 max-w-md"
              publicationId={publicationId}
              setExpanded={setExpanded}
              type={type}
            />
          </div>
          {(isTrustedReport || isNormalReport) && (
            <ReportDetails
              isTrustedReport={isTrustedReport}
              publicationId={publicationId}
            />
          )}
        </>
      )}
      {trusted && !isTrustedReport && !isNormalReport && (
        <>
          <div className="divider" />
          <div className="m-5">
            <b>Moderate Post</b>
            <TrustedProfilesActions publicationId={publicationId} />
          </div>
        </>
      )}
    </div>
  );
};

export default Actions;
