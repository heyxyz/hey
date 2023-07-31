import { FlagIcon } from '@heroicons/react/outline';
import type { Profile } from '@lenster/lens';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import { type FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';

interface ReportProfileProps {
  profile: Profile;
}

const Report: FC<ReportProfileProps> = ({ profile }) => {
  const setShowReportProfileModal = useGlobalModalStateStore(
    (state) => state.setShowReportProfileModal
  );

  return (
    <button
      type="button"
      className={clsx(
        'm-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm hover:bg-gray-300/20'
      )}
      onClick={() => setShowReportProfileModal(true, profile)}
    >
      <div className="flex items-center space-x-2">
        <FlagIcon className="h-4 w-4" />
        <div>
          <Trans>Report Profile</Trans>
        </div>
      </div>
    </button>
  );
};

export default Report;
