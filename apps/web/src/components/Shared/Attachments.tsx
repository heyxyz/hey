import { ATTACHMENT } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import imageKit from '@hey/lib/imageKit';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import type { MetadataAsset } from '@hey/types/misc';
import { Image, LightBox } from '@hey/ui';
import cn from '@hey/ui/cn';
import type { FC } from 'react';
import { memo, useState } from 'react';

import { Leafwatch } from '@/lib/leafwatch';

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

interface MetadataAttachment {
  uri: string;
  type: 'Image' | 'Video' | 'Audio';
}

interface AttachmentsProps {
  attachments: MetadataAttachment[];
  asset?: MetadataAsset;
}

const Attachments: FC<AttachmentsProps> = ({ attachments, asset }) => {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const processedAttachments = attachments.slice(0, 4);

  const assetIsImage = asset?.type === 'Image';
  const assetIsVideo = asset?.type === 'Video';
  const assetIsAudio = asset?.type === 'Audio';

  const attachmentsHasImage = processedAttachments.some(
    (attachment) => attachment.type === 'Image'
  );

  const determineDisplay = ():
    | 'displayVideoAsset'
    | 'displayAudioAsset'
    | 'displayImageAsset'
    | MetadataAttachment[]
    | null => {
    if (assetIsVideo) {
      return 'displayVideoAsset';
    } else if (assetIsAudio) {
      return 'displayAudioAsset';
    } else if (attachmentsHasImage) {
      const imageAttachments = processedAttachments.filter(
        (attachment) => attachment.type === 'Image'
      );

      return imageAttachments;
    } else if (assetIsImage) {
      return 'displayImageAsset';
    }

    return null;
  };

  const displayDecision = determineDisplay();

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
    />
  );

  return (
    <div className="mt-3">
      {displayDecision === 'displayImageAsset' && assetIsImage && (
        <div
          className={cn(getClass(1)?.aspect, 'w-2/3')}
          onClick={stopEventPropagation}
        >
          <ImageComponent uri={asset.uri} />
        </div>
      )}
      {Array.isArray(displayDecision) && (
        <div
          className={cn('grid gap-2', getClass(displayDecision.length)?.row)}
        >
          {displayDecision.map((attachment, index) => {
            return (
              <div
                key={index}
                className={cn(
                  `${getClass(displayDecision.length)?.aspect} ${
                    displayDecision.length === 3 && index === 0
                      ? 'row-span-2'
                      : ''
                  }`,
                  { 'w-2/3': displayDecision.length === 1 }
                )}
                onClick={stopEventPropagation}
              >
                <ImageComponent uri={attachment.uri} />
              </div>
            );
          })}
        </div>
      )}
      {displayDecision === 'displayVideoAsset' && (
        <Video src={asset?.uri as string} poster={asset?.cover} />
      )}
      {displayDecision === 'displayAudioAsset' && (
        <Audio
          src={asset?.uri as string}
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

export default memo(Attachments);
