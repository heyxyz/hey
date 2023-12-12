import type { MetadataAsset } from '@hey/types/misc';
import type { FC } from 'react';

import { ATTACHMENT } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import imageKit from '@hey/lib/imageKit';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import { Image, LightBox } from '@hey/ui';
import cn from '@hey/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { memo, useState } from 'react';

import Audio from './Audio';
import Video from './Video';

const getClass = (attachments: number) => {
  if (attachments === 1) {
    return {
      aspect: '',
      row: 'grid-cols-1 grid-rows-1'
    };
  }

  if (attachments === 2) {
    return {
      aspect: 'aspect-w-16 aspect-h-12',
      row: 'grid-cols-2 grid-rows-1'
    };
  }

  if (attachments > 2) {
    return {
      aspect: 'aspect-w-16 aspect-h-12',
      row: 'grid-cols-2 grid-rows-2'
    };
  }
};

interface MetadataAttachment {
  type: 'Audio' | 'Image' | 'Video';
  uri: string;
}

interface AttachmentsProps {
  asset?: MetadataAsset;
  attachments: MetadataAttachment[];
}

const Attachments: FC<AttachmentsProps> = ({ asset, attachments }) => {
  const [expandedImage, setExpandedImage] = useState<null | string>(null);
  const processedAttachments = attachments.slice(0, 4);

  const assetIsImage = asset?.type === 'Image';
  const assetIsVideo = asset?.type === 'Video';
  const assetIsAudio = asset?.type === 'Audio';

  const attachmentsHasImage = processedAttachments.some(
    (attachment) => attachment.type === 'Image'
  );

  const determineDisplay = ():
    | 'displayAudioAsset'
    | 'displayImageAsset'
    | 'displayVideoAsset'
    | MetadataAttachment[]
    | null => {
    if (assetIsVideo) {
      return 'displayVideoAsset';
    }

    if (assetIsAudio) {
      return 'displayAudioAsset';
    }

    if (attachmentsHasImage) {
      const imageAttachments = processedAttachments.filter(
        (attachment) => attachment.type === 'Image'
      );

      return imageAttachments;
    }

    if (assetIsImage) {
      return 'displayImageAsset';
    }

    return null;
  };

  const displayDecision = determineDisplay();

  const ImageComponent = ({ uri }: { uri: string }) => (
    <Image
      alt={imageKit(uri, ATTACHMENT)}
      className="cursor-pointer rounded-lg border bg-gray-100 object-cover dark:border-gray-700 dark:bg-gray-800"
      height={1000}
      loading="lazy"
      onClick={() => {
        setExpandedImage(uri);
        Leafwatch.track(PUBLICATION.ATTACHMENT.IMAGE.OPEN, {
          // publication_id: publication?.id
        });
      }}
      onError={({ currentTarget }) => {
        currentTarget.src = uri;
      }}
      src={imageKit(uri, ATTACHMENT)}
      width={1000}
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
                className={cn(
                  `${getClass(displayDecision.length)?.aspect} ${
                    displayDecision.length === 3 && index === 0
                      ? 'row-span-2'
                      : ''
                  }`,
                  { 'w-2/3': displayDecision.length === 1 }
                )}
                key={attachment.uri}
                onClick={stopEventPropagation}
              >
                <ImageComponent uri={attachment.uri} />
              </div>
            );
          })}
        </div>
      )}
      {displayDecision === 'displayVideoAsset' && (
        <Video poster={asset?.cover} src={asset?.uri as string} />
      )}
      {displayDecision === 'displayAudioAsset' && (
        <Audio
          artist={asset?.artist}
          expandCover={setExpandedImage}
          poster={asset?.cover as string}
          src={asset?.uri as string}
          title={asset?.title}
        />
      )}
      <LightBox
        onClose={() => setExpandedImage(null)}
        show={Boolean(expandedImage)}
        url={expandedImage}
      />
    </div>
  );
};

export default memo(Attachments);
