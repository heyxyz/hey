import type { FC } from 'react';

import { PUBLICATION } from '@hey/data/tracking';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { TipIcon } from '@hey/icons';
import { TipIconSolid } from '@hey/icons/src/TipIconSolid';
import {
  type AnyPublication,
  type UnknownOpenActionModuleSettings,
  useUnknownOpenActionDataQuery
} from '@hey/lens';
import nFormatter from '@hey/lib/nFormatter';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import { Modal, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import TipOpenActionModule from './Module';

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
  const [hasTipped, setHasTipped] = useState(false);
  const [countTips, setCountTips] = useState<number>(0);

  const { data: tipData } = useUnknownOpenActionDataQuery({
    variables: {
      module: VerifiedOpenActionModules.Tip,
      pubId: targetPublication.id
    }
  });

  useEffect(() => {
    setHasTipped(
      tipData?.publication?.__typename === 'Post' &&
        Boolean(tipData.publication.operations.actedOn.length)
    );
    if (tipData?.publication?.__typename === 'Post') {
      setCountTips(tipData.publication.stats.countOpenActions);
    }
  }, [tipData]);

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
    <>
      <div
        className={cn(
          hasTipped ? 'text-brand-500' : 'ld-text-gray-500',
          'flex items-center space-x-1'
        )}
      >
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
            {hasTipped ? (
              <TipIconSolid className={iconClassName} />
            ) : (
              <TipIcon className={iconClassName} />
            )}
          </Tooltip>
        </motion.button>
        {countTips > 0 && !isFullPublication ? (
          <span className="text-[11px] sm:text-xs">
            {nFormatter(countTips)}
          </span>
        ) : null}
      </div>
      <Modal
        icon={<TipIcon className="size-5" />}
        onClose={() => setShowOpenActionModal(false)}
        show={showOpenActionModal}
        title="Send a tip"
      >
        <TipOpenActionModule
          module={module as UnknownOpenActionModuleSettings}
          publication={targetPublication}
        />
      </Modal>
    </>
  );
};

export default TipOpenAction;
