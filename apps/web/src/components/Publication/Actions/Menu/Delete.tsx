import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import { Menu } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/24/outline';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import cn from '@hey/ui/cn';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';

interface DeleteProps {
  publication: AnyPublication;
}

const Delete: FC<DeleteProps> = ({ publication }) => {
  const setShowPublicationDeleteAlert = useGlobalAlertStateStore(
    (state) => state.setShowPublicationDeleteAlert
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
        setShowPublicationDeleteAlert(true, publication);
      }}
    >
      <div className="flex items-center space-x-2">
        <TrashIcon className="size-4" />
        <div>Delete</div>
      </div>
    </Menu.Item>
  );
};

export default Delete;
