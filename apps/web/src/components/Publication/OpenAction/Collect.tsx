import type { MirrorablePublication } from '@hey/lens';
import type { FC } from 'react';

import { Leafwatch } from '@helpers/leafwatch';
import hasOptimisticallyCollected from '@helpers/optimistic/hasOptimisticallyCollected';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { PUBLICATION } from '@hey/data/tracking';
import allowedOpenActionModules from '@hey/helpers/allowedOpenActionModules';
import { Button, Modal } from '@hey/ui';
import { useState } from 'react';

import CollectModule from './CollectModule';

interface CollectProps {
  publication: MirrorablePublication;
}

const Collect: FC<CollectProps> = ({ publication }) => {
  const [showOpenActionModal, setShowOpenActionModal] = useState(false);
  const openActions = publication.openActionModules.filter((module) =>
    allowedOpenActionModules.includes(module.type)
  );

  const hasActed =
    publication.operations.hasActed.value ||
    hasOptimisticallyCollected(publication.id);

  return (
    <>
      <Button
        onClick={() => {
          setShowOpenActionModal(true);
          Leafwatch.track(PUBLICATION.COLLECT_MODULE.OPEN_COLLECT, {
            publication_id: publication.id
          });
        }}
        outline={!hasActed}
        size="sm"
      >
        {hasActed ? 'Collected' : 'Collect'}
      </Button>
      <Modal
        icon={<ShoppingBagIcon className="size-5" />}
        onClose={() => setShowOpenActionModal(false)}
        show={showOpenActionModal}
        title="Collect"
      >
        {openActions?.map((action) => (
          <CollectModule
            key={action.type}
            openAction={action}
            publication={publication}
          />
        ))}
      </Modal>
    </>
  );
};

export default Collect;
