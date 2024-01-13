import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import { FlagIcon } from '@heroicons/react/24/outline';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

interface ReportProfileProps {
  profile: Profile;
}

const Report: FC<ReportProfileProps> = ({ profile }) => {
  const setShowReportProfileModal = useGlobalModalStateStore(
    (state) => state.setShowReportProfileModal
  );

  return (
    <DropdownMenuItem
      className="m-2 flex cursor-pointer items-center space-x-2 rounded-lg px-2 py-1.5 text-sm focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800"
      onClick={() => setShowReportProfileModal(true, profile)}
    >
      <FlagIcon className="size-4" />
      <div>Report profile</div>
    </DropdownMenuItem>
  );
};

export default Report;
