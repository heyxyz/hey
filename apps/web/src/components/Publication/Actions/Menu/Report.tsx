import { Menu } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import type { Publication } from '@hey/lens';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import cn from '@hey/ui/cn';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';

interface ReportProps {
  publication: Publication;
}

const Report: FC<ReportProps> = ({ publication }) => {
  const setShowPublicationReportModal = useGlobalModalStateStore(
    (state) => state.setShowPublicationReportModal
  );

  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        cn(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm text-red-500'
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        setShowPublicationReportModal(true, publication);
      }}
    >
      <div className="flex items-center space-x-2">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <div>Report post</div>
      </div>
    </Menu.Item>
  );
};

export default Report;
