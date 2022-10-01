import { LensterPublication } from '@generated/lenstertypes';
import { Menu } from '@headlessui/react';
import { ShieldExclamationIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React, { FC } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';

interface Props {
  publication: LensterPublication;
}

const Report: FC<Props> = ({ publication }) => {
  const setShowReportModal = useGlobalModalStateStore((state) => state.setShowReportModal);

  return (
    <Menu.Item
      as="div"
      className={({ active }: { active: boolean }) =>
        clsx(
          { 'dropdown-active': active },
          'block px-4 py-1.5 text-sm text-red-500 m-2 rounded-lg cursor-pointer'
        )
      }
      onClick={() => {
        setShowReportModal(true, publication);
      }}
    >
      <div className="flex items-center space-x-2">
        <ShieldExclamationIcon className="w-4 h-4" />
        <div>Report Post</div>
      </div>
    </Menu.Item>
  );
};

export default Report;
