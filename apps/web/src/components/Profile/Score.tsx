import { FireIcon } from '@heroicons/react/24/outline';
import { APP_NAME } from '@hey/data/constants';
import getHeyScore from '@hey/lib/api/getHeyScore';
import humanize from '@hey/lib/humanize';
import { Button, Modal } from '@hey/ui';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import isFeatureAvailable from '@lib/isFeatureAvailable';
import { useQuery } from '@tanstack/react-query';
import { type FC, useState } from 'react';

import { MetaDetails } from './Details';

interface ScoreProps {
  address: string;
}

const Score: FC<ScoreProps> = ({ address }) => {
  const [showModal, setShowModal] = useState(false);

  const { data: score, isLoading } = useQuery({
    queryFn: () => getHeyScore(address, getAuthApiHeaders()),
    queryKey: ['getHeyScore', address || '']
  });

  if (!isFeatureAvailable('hey-score')) {
    return null;
  }

  if (isLoading || !score) {
    return null;
  }

  return (
    <>
      <MetaDetails icon={<FireIcon className="size-4" />}>
        <Button
          className="text-xs font-medium"
          onClick={() => setShowModal(true)}
          size="sm"
          variant="secondary"
        >
          {humanize(score)}
        </Button>
      </MetaDetails>
      <Modal
        icon={<FireIcon className="size-5" />}
        onClose={() => setShowModal(false)}
        show={showModal}
        size="xs"
        title={`${APP_NAME} score`}
      >
        <div className="p-5 text-center leading-7">
          Your <b>{APP_NAME} score</b> is determined by a super-secret algorithm
          that combines the number of likes, collects you've received, the
          publications you've posted, and lot other factors 🤓
        </div>
      </Modal>
    </>
  );
};

export default Score;
