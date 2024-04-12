import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import { PUBLICATION } from '@hey/data/tracking';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { TipIcon } from '@hey/icons';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Tooltip } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface TipOpenActionProps {
  isFullPublication?: boolean;
  publication: AnyPublication;
}

const TipOpenAction: FC<TipOpenActionProps> = ({
  isFullPublication = false,
  publication
}) => {
  const [showOpenActionModal, setShowOpenActionModal] = useState(false);
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const module = targetPublication.openActionModules.find(
    (module) => module.contract.address === VerifiedOpenActionModules.Tip
  );

  if (!module) {
    return null;
  }

  const iconClassName = isFullPublication
    ? 'w-[17px] sm:w-[20px]'
    : 'w-[15px] sm:w-[18px]';

  return (
    <div className="ld-text-gray-500">
      <motion.button
        aria-label="Tip"
        className="rounded-full p-1.5 outline-offset-2 hover:bg-gray-300/20"
        onClick={() => {
          setShowOpenActionModal(true);
          Leafwatch.track(PUBLICATION.OPEN_ACTIONS.TIP.OPEN_TIP, {
            publication_id: publication.id
          });
        }}
        whileTap={{ scale: 0.9 }}
      >
        <Tooltip content="Tip" placement="top" withDelay>
          <TipIcon className={iconClassName} />
        </Tooltip>
      </motion.button>
    </div>
  );
};

export default TipOpenAction;
