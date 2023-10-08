import type { MetadataAsset } from '@hey/types/misc';
import { LightBox } from '@hey/ui';
import cn from '@hey/ui/cn';
import type { FC } from 'react';
import { useState } from 'react';

import Audio from './Audio';
import Video from './Video';

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
  asset?: MetadataAsset;
}

const Attachments: FC<AttachmentsProps> = ({ attachments, asset }) => {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const attachmentsLength = attachments.length;

  const isVideo =
    asset?.type === 'Video' ||
    attachments.map((attachment) => attachment.type === 'Video').includes(true);
  const isAudio =
    asset?.type === 'Audio' ||
    attachments.map((attachment) => attachment.type === 'Audio').includes(true);

  return (
    <div className={cn(getClass(attachmentsLength)?.row, 'mt-3 grid gap-2')}>
      {isVideo && (
        <Video src={asset?.uri || attachments[0].uri} poster={asset?.cover} />
      )}
      {isAudio && (
        <Audio
          src={asset?.uri || attachments[0].uri}
          poster={asset?.cover as string}
          artist={asset?.artist}
          title={asset?.title}
          expandCover={setExpandedImage}
        />
      )}
      {/* att: {JSON.stringify(attachments)}
      asset: {JSON.stringify(asset)} */}{' '}
      <LightBox
        show={Boolean(expandedImage)}
        url={expandedImage}
        onClose={() => setExpandedImage(null)}
      />
    </div>
  );
};

export default Attachments;
