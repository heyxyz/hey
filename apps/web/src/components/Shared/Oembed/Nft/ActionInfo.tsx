import type { UIData } from 'nft-openaction-kit';
import type { FC } from 'react';

import truncateByWords from '@hey/helpers/truncateByWords';
import { Image } from '@hey/ui';

const formatPrice = (value: Number) => {
  const num = Number(value);
  if (num < 1) {
    if (num < 0.0001) {
      return '<0.0001';
    }
    return num.toFixed(3);
  }
  return Math.round(num).toString();
};

interface ActionInfoProps {
  collectionName: string;
  uiData?: UIData;
}

const ActionInfo: FC<ActionInfoProps> = ({ collectionName, uiData }) => {
  return (
    <div className="flex items-center space-x-2">
      <Image
        alt={uiData?.platformName}
        className="size-5 rounded-full border bg-gray-200 dark:border-gray-700"
        height={20}
        loading="lazy"
        src={uiData?.platformLogoUrl}
        width={20}
      />
      <b className="text-sm">{truncateByWords(collectionName, 3)}</b>
    </div>
  );
};

export default ActionInfo;
