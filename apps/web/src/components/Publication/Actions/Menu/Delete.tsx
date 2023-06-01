import { Menu } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/outline';
import type { Publication } from '@lenster/lens';
import clsx from 'clsx';
import stopEventPropagation from 'lib/stopEventPropagation';
import type { FC } from 'react';
import { useGlobalAlertStateStore } from 'src/store/alerts';

interface DeleteProps {
  publication: Publication;
}

const Delete: FC<DeleteProps> = ({ publication }) => {
  const setShowPublicationDeleteAlert = useGlobalAlertStateStore(
    (state) => state.setShowPublicationDeleteAlert
  );

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
        setShowPublicationDeleteAlert(true, publication);
      }}
    >
      <div className="flex items-center space-x-2">
        <TrashIcon className="h-4 w-4" />
        <div>Delete</div>
      </div>
    </Menu.Item>
  );
};

export default Delete;
