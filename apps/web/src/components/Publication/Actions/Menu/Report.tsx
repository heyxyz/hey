import { Menu } from '@headlessui/react';
import { ShieldExclamationIcon } from '@heroicons/react/outline';
import { stopEventPropagation } from '@lib/stopEventPropagation';
import clsx from 'clsx';
import type { Publication } from 'lens';
import type { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';

interface ReportProps {
  publication: Publication;
}

const Report: FC<ReportProps> = ({ publication }) => {
  const setShowReportModal = useGlobalModalStateStore((state) => state.setShowReportModal);

  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        clsx(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm text-red-500'
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        setShowReportModal(true, publication);
      }}
    >
      <div className="flex items-center space-x-2">
        <ShieldExclamationIcon className="h-4 w-4" />
        <div>Report Post</div>
      </div>
    </Menu.Item>
  );
};

export default Report;
