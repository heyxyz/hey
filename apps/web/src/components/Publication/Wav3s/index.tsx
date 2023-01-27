import { Card } from '@components/UI/Card';
import getPublicationAttribute from '@lib/getPublicationAttribute';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { Publication } from 'lens';
import type { FC } from 'react';
import { useAppStore } from 'src/store/app';

dayjs.extend(relativeTime);

interface Props {
  publication: Publication;
}

const Wav3s: FC<Props> = ({ publication }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const isWav3sPublication =
    getPublicationAttribute(publication.metadata.attributes, 'createdIn') === 'wav3s';

  if (!isWav3sPublication || !isFeatureEnabled('wav3s', currentProfile?.id)) {
    return null;
  }

  return <Card className="py-3 px-5 my-5 text-sm bg-gray-50">gm</Card>;
};

export default Wav3s;
