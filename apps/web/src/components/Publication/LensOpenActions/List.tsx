import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import allowedOpenActionModules from '@hey/lib/allowedOpenActionModules';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';

import CollectModule from './CollectModule';
import UnknownModulePreview from './UnknownModule/Preview';

interface ListProps {
  publication: AnyPublication;
}

const List: FC<ListProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const openActions = targetPublication.openActionModules;

  return (
    <div className="gap-y-4 divide-y dark:divide-gray-700">
      {openActions?.map((action) =>
        allowedOpenActionModules.includes(action.type) ? (
          <CollectModule
            key={action.type}
            openAction={action}
            publication={publication}
          />
        ) : (
          <div className="w-full p-5" key={action.contract.address}>
            <UnknownModulePreview module={action} />
          </div>
        )
      )}
    </div>
  );
};

export default List;
