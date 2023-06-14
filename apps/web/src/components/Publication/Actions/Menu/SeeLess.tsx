import { Menu } from '@headlessui/react';
import { EyeOffIcon } from '@heroicons/react/outline';
import type { Publication } from '@lenster/lens';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import clsx from 'clsx';
import type { FC } from 'react';
import { useGlobalAlertStateStore } from 'src/store/alerts';

interface SeeLessProps {
  publication: Publication;
}

const SeeLess: FC<SeeLessProps> = ({ publication }) => {
  const setShowPublicationDeleteAlert = useGlobalAlertStateStore(
    (state) => state.setShowPublicationDeleteAlert
  );

  return (
    <Menu.Item
      as="div"
      className={({ active }) =>
        clsx(
          { 'dropdown-active': active },
          'm-2 block cursor-pointer rounded-lg px-4 py-1.5 text-sm'
        )
      }
      onClick={(event) => {
        stopEventPropagation(event);
        setShowPublicationDeleteAlert(true, publication);
      }}
    >
      <div className="flex items-center space-x-2">
        <EyeOffIcon className="h-4 w-4" />
        <div>See Less</div>
      </div>
    </Menu.Item>
  );
};

export default SeeLess;
