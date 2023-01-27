import { Card } from '@components/UI/Card';
import CircularProgressBar from '@components/UI/CircularProgressBar';
import { GiftIcon } from '@heroicons/react/outline';
import getPublicationAttribute from '@lib/getPublicationAttribute';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { Publication } from 'lens';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';
import { usePreferencesStore } from 'src/store/preferences';

dayjs.extend(relativeTime);

interface Props {
  publication: Publication;
}

const Wav3s: FC<Props> = ({ publication }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const hideWav3sReward = usePreferencesStore((state) => state.hideWav3sReward);

  const isWav3sPublication =
    getPublicationAttribute(publication.metadata.attributes, 'createdIn') === 'wav3s';

  if (!isWav3sPublication || hideWav3sReward || !isFeatureEnabled('wav3s', currentProfile?.id)) {
    return null;
  }

  return (
    <Card className="py-3 px-5 my-5 text-xs bg-pink-50 border-pink-300 flex">
      <div className="font-bold text-pink-500 flex items-center space-x-1.5">
        <GiftIcon className="h-4 w-4" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 dark:from-pink-400 to-brand-600 dark:to-brand-400">
          You can earn reward by mirroring this <span className="lowercase">{publication.__typename}</span>
        </span>
      </div>
      <CircularProgressBar value={80} label="50" />
    </Card>
  );
};

export default Wav3s;
