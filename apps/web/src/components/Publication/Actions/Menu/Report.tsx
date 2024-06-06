import type { MirrorablePublication } from '@good/lens';
import type { FC } from 'react';

import stopEventPropagation from '@good/helpers/stopEventPropagation';
import cn from '@good/ui/cn';
import { MenuItem } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';

interface ReportProps {
  publication: MirrorablePublication;
}

const Report: FC<ReportProps> = ({ publication }) => {
  const { setShowPublicationReportModal } = useGlobalModalStateStore();

  return (
    <MenuItem
      as="div"
      className={({ focus }) =>
        cn(
          { 'dropdown-active': focus },
          'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm text-red-500'
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        setShowPublicationReportModal(true, publication.id);
      }}
    >
      <div className="flex items-center space-x-2">
        <ExclamationTriangleIcon className="size-4" />
        <div>Report post</div>
      </div>
    </MenuItem>
  );
};

export default Report;
