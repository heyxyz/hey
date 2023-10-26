import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { type AnyPublication, OpenActionModuleType } from '@hey/lens';
import getOpenActionModuleData from '@hey/lib/getOpenActionModuleData';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Card } from '@hey/ui';
import type { FC } from 'react';
import { useState } from 'react';

import CollectModule from './CollectModule';
import CollectModulePreview from './CollectModule/Preview';
import UnknownModulePreview from './UnknownModule/Preview';

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
            disabled={
              action.type === OpenActionModuleType.UnknownOpenActionModule
            }
            onClick={() => {
              selectedSetOpenActionIndex(index);
              setOpenActionScreen('ACTION');
            }}
          >
            {(action.type ===
              OpenActionModuleType.SimpleCollectOpenActionModule ||
              action.type ===
                OpenActionModuleType.MultirecipientFeeCollectOpenActionModule) && (
              <CollectModulePreview module={action} publication={publication} />
            )}
            {action.type === OpenActionModuleType.UnknownOpenActionModule && (
              <UnknownModulePreview module={action} />
            )}
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
            <div className="font-bold">
              {getOpenActionModuleData(selectedOpenAction)?.name}
            </div>
          </div>
          <Card className="mt-5">
            {selectedOpenAction?.__typename ===
              'SimpleCollectOpenActionSettings' ||
            selectedOpenAction?.__typename ===
              'MultirecipientFeeCollectOpenActionSettings' ? (
              <CollectModule
                publication={publication}
                openAction={selectedOpenAction}
              />
            ) : null}
          </Card>
        </div>
      )}
    </div>
  );
};

export default List;
