import type { MetadataAsset } from '@hey/types/misc';
import type { FC } from 'react';

import { Leafwatch } from '@helpers/leafwatch';
import { ATTACHMENT } from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import imageKit from '@hey/helpers/imageKit';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import { Image, LightBox } from '@hey/ui';
import cn from '@hey/ui/cn';
import { memo, useState } from 'react';

import Audio from './Audio';
import Video from './Video';

const getClass = (attachments: number) => {
  if (attachments === 1) {
    return { aspect: '', row: 'grid-cols-1 grid-rows-1' };
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

  const attachmentsHasImage =
    processedAttachments.some((attachment) => attachment.type === 'Image') ||
    assetIsImage;

  const determineDisplay = ():
    | 'displayAudioAsset'
    | 'displayVideoAsset'
    | null
    | string[] => {
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
      const assetImage = asset?.uri;

      const finalAttachments = imageAttachments.map(
        (attachment) => attachment.uri
      );
      finalAttachments.unshift(assetImage!);

      const attachmentsWithoutDuplicates = [...new Set(finalAttachments)];

      return attachmentsWithoutDuplicates;
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
        Leafwatch.track(PUBLICATION.ATTACHMENT.IMAGE.OPEN);
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
      {Array.isArray(displayDecision) && (
        <div
          className={cn('grid gap-2', getClass(displayDecision.length)?.row)}
        >
          {displayDecision.map((attachment, index) => {
            return (
              <div
                className={cn(
                  getClass(displayDecision.length)?.aspect,
                  { 'row-span-2': displayDecision.length === 3 && index === 0 },
                  { 'col-span-2': displayDecision.length === 5 && index === 0 },
                  { 'w-2/3': displayDecision.length === 1 }
                )}
                key={attachment}
                onClick={stopEventPropagation}
              >
                <ImageComponent uri={attachment} />
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
