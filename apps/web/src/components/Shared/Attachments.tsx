import { ATTACHMENT } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import imageKit from '@hey/lib/imageKit';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import type { MetadataAsset } from '@hey/types/misc';
import { Image, LightBox } from '@hey/ui';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
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

  const isImages =
    asset?.type === 'Image' ||
    attachments.map((attachment) => attachment.type === 'Image').includes(true);
  const isVideo =
    asset?.type === 'Video' ||
    attachments.map((attachment) => attachment.type === 'Video').includes(true);
  const isAudio =
    asset?.type === 'Audio' ||
    attachments.map((attachment) => attachment.type === 'Audio').includes(true);

  const ImageComponent = ({ uri }: { uri: string }) => (
    <Image
      className="cursor-pointer rounded-lg border bg-gray-100 object-cover dark:border-gray-700 dark:bg-gray-800"
      loading="lazy"
      height={1000}
      width={1000}
      onError={({ currentTarget }) => {
        currentTarget.src = uri;
      }}
      onClick={() => {
        setExpandedImage(uri);
        Leafwatch.track(PUBLICATION.ATTACHMENT.IMAGE.OPEN, {
          // publication_id: publication?.id
        });
      }}
      src={imageKit(uri, ATTACHMENT)}
      alt={imageKit(uri, ATTACHMENT)}
      data-testid={`attachment-image-${uri}`}
    />
  );

  return (
    <div className={cn(getClass(attachmentsLength)?.row, 'mt-3 grid gap-2')}>
      {isImages && asset?.type === 'Image' ? (
        <div
          className={cn(getClass(1)?.aspect, 'w-2/3')}
          onClick={stopEventPropagation}
          aria-hidden="true"
        >
          <ImageComponent uri={asset.uri} />
        </div>
      ) : (
        attachments.map((attachment, index) => {
          return (
            <div
              key={index}
              className={cn(
                `${getClass(attachmentsLength)?.aspect} ${
                  attachmentsLength === 3 && index === 0 ? 'row-span-2' : ''
                }`,
                { 'w-2/3': attachmentsLength === 1 },
                'relative'
              )}
              onClick={stopEventPropagation}
              aria-hidden="true"
            >
              <ImageComponent uri={attachment.uri} />
            </div>
          );
        })
      )}
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
      <LightBox
        show={Boolean(expandedImage)}
        url={expandedImage}
        onClose={() => setExpandedImage(null)}
      />
    </div>
  );
};

export default Attachments;
