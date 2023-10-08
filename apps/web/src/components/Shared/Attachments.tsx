import cn from '@hey/ui/cn';
import type { FC } from 'react';
import { useState } from 'react';

const getClass = (attachments: number) => {
  if (attachments === 1) {
    return {
      aspect: '',
      row: 'grid-cols-1 grid-rows-1'
    };
  } else if (attachments === 2) {
    return {
      aspect: 'aspect-w-16 aspect-h-12',
      row: 'grid-cols-2 grid-rows-1'
    };
  } else if (attachments > 2) {
    return {
      aspect: 'aspect-w-16 aspect-h-12',
      row: 'grid-cols-2 grid-rows-2'
    };
  }
};

interface AttachmentsProps {
  attachments: {
    uri: string;
    type: 'Image' | 'Video' | 'Audio';
  }[];
  asset?: {
    uri: string;
    type: 'Image' | 'Video' | 'Audio';
  };
}

const Attachments: FC<AttachmentsProps> = ({ attachments, asset }) => {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const attachmentsLength = attachments.length;

  return (
    <div className={cn(getClass(attachmentsLength)?.row, 'mt-3 grid gap-2')}>
      att: {JSON.stringify(attachments)}
      asset: {JSON.stringify(asset)}
    </div>
  );
};

export default Attachments;
