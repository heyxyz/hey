import { FireIcon } from '@heroicons/react/24/outline';
import { APP_NAME } from '@hey/data/constants';
import getScore from '@hey/lib/api/getScore';
import humanize from '@hey/lib/humanize';
import { Button, Modal } from '@hey/ui';
import isFeatureAvailable from '@lib/isFeatureAvailable';
import { useQuery } from '@tanstack/react-query';
import { type FC, useState } from 'react';

import { MetaDetails } from './Details';

interface ScoreProps {
  id: string;
}

const Score: FC<ScoreProps> = ({ id }) => {
  const [showModal, setShowModal] = useState(false);

  const { data: score, isLoading } = useQuery({
    queryFn: () => getScore(id),
    queryKey: ['getScore', id]
  });

  if (!isFeatureAvailable('hey-score')) {
    return null;
  }

  if (isLoading || !score?.score) {
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
          {humanize(score.score)}
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
