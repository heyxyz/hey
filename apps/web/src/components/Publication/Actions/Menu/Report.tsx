import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

interface ReportProps {
  publication: AnyPublication;
}

const Report: FC<ReportProps> = ({ publication }) => {
  const setShowPublicationReportModal = useGlobalModalStateStore(
    (state) => state.setShowPublicationReportModal
  );

  return (
    <DropdownMenuItem
      className="m-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm text-red-500 focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800"
      onClick={(event) => {
        stopEventPropagation(event);
        setShowPublicationReportModal(true, publication.id);
      }}
    >
      <div className="flex items-center space-x-2">
        <ExclamationTriangleIcon className="size-4" />
        <div>Report post</div>
      </div>
    </DropdownMenuItem>
  );
};

export default Report;
