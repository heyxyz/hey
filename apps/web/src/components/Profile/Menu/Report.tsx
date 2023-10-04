import { FlagIcon } from '@heroicons/react/24/outline';
import type { Profile } from '@hey/lens';
import cn from '@hey/ui/cn';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
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
      className={cn(
        'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm hover:bg-gray-300/20'
      )}
      onClick={() => setShowReportProfileModal(true, profile)}
    >
      <div className="flex items-center space-x-2">
        <FlagIcon className="h-4 w-4" />
        <div>
          <Trans>Report profile</Trans>
        </div>
      </div>
    </button>
  );
};

export default Report;
