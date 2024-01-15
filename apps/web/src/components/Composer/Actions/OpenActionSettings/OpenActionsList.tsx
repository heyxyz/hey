import type { Dispatch, FC, SetStateAction } from 'react';

import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { Button } from '@hey/ui';

import OpenActionItem from './OpenActionItem';

interface OpenActionsListProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const OpenActionsList: FC<OpenActionsListProps> = ({ setShowModal }) => {
  return (
    <div className="p-5">
      <div>
        <OpenActionItem
          description="Collect responses from anyone with a link"
          icon={<CurrencyDollarIcon className="size-6" />}
          setShowModal={setShowModal}
          title="Anyone with a link"
        />
      </div>
      <div className="mt-5 flex space-x-2">
        <Button
          className="ml-auto"
          onClick={() => {
            setShowModal(false);
          }}
          outline
          variant="danger"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default OpenActionsList;
