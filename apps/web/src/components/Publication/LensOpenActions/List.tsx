import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import type { AnyPublication } from '@hey/lens';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Card } from '@hey/ui';
import { type FC, useState } from 'react';

interface ListProps {
  publication: AnyPublication;
}

const List: FC<ListProps> = ({ publication }) => {
  const [openActionScreen, setOpenActionScreen] = useState<'LIST' | 'ACTION'>(
    'LIST'
  );
  const [selectedOpenActionIndex, selectedSetOpenActionIndex] = useState<
    number | null
  >(null);

  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const openActions = targetPublication.openActionModules;
  const selectedOpenAction = openActions?.[selectedOpenActionIndex || 0];

  return (
    <div className="p-5">
      {openActionScreen === 'LIST' ? (
        openActions?.map((action, index) => (
          <button
            key={action.type}
            className="w-full"
            onClick={() => {
              selectedSetOpenActionIndex(index);
              setOpenActionScreen('ACTION');
            }}
          >
            <Card className="p-5">{action.type}</Card>
          </button>
        ))
      ) : (
        <div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                selectedSetOpenActionIndex(null);
                setOpenActionScreen('LIST');
              }}
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div className="font-bold">{selectedOpenAction?.type}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
