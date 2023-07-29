import { FlagIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import { type FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';

const Report: FC = () => {
  const setReportProfileModal = useGlobalModalStateStore(
    (state) => state.setReportProfileModal
  );

  return (
    <button
      type="button"
      className={clsx(
        'm-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm'
      )}
      onClick={() => setReportProfileModal(true)}
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
