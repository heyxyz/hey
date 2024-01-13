import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import { TrashIcon } from '@heroicons/react/24/outline';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { useGlobalAlertStateStore } from 'src/store/non-persisted/useGlobalAlertStateStore';

interface DeleteProps {
  publication: AnyPublication;
}

const Delete: FC<DeleteProps> = ({ publication }) => {
  const setShowPublicationDeleteAlert = useGlobalAlertStateStore(
    (state) => state.setShowPublicationDeleteAlert
  );

  return (
    <DropdownMenuItem
      className="m-2 block cursor-pointer rounded-lg px-2 py-1.5 text-sm text-red-500 focus:outline-none data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800"
      onClick={(event) => {
        stopEventPropagation(event);
        setShowPublicationDeleteAlert(true, publication);
      }}
    >
      <div className="flex items-center space-x-2">
        <TrashIcon className="size-4" />
        <div>Delete</div>
      </div>
    </DropdownMenuItem>
  );
};

export default Delete;
