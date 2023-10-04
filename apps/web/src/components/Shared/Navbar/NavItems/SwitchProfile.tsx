import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import cn from '@hey/ui/cn';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';

interface SwitchProfileProps {
  className?: string;
}

const SwitchProfile: FC<SwitchProfileProps> = ({ className = '' }) => {
  const setShowProfileSwitchModal = useGlobalModalStateStore(
    (state) => state.setShowProfileSwitchModal
  );

  return (
    <button
      type="button"
      className={cn(
        'flex w-full px-2 py-1.5 text-left text-sm text-gray-700 focus:outline-none dark:text-gray-200',
        className
      )}
      onClick={() => setShowProfileSwitchModal(true)}
    >
      <div className="flex items-center space-x-2">
        <div>
          <ArrowsRightLeftIcon className="h-4 w-4" />
        </div>
        <span>
          <Trans>Switch profile</Trans>
        </span>
      </div>
    </button>
  );
};

export default SwitchProfile;
