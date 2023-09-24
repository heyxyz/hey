import { ATTACHMENT } from '@lenster/data/constants';
import { PUBLICATION } from '@lenster/data/tracking';
import type { AnyPublication } from '@lenster/lens';
import imageKit from '@lenster/lib/imageKit';
import { isMirrorPublication } from '@lenster/lib/publicationHelpers';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import { Image, LightBox } from '@lenster/ui';
import cn from '@lenster/ui/cn';
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
  publication: AnyPublication;
}

const Attachments: FC<AttachmentsProps> = ({ publication }) => {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;

  const { metadata } = targetPublication;

  const imageAttachments =
    metadata.__typename === 'ArticleMetadataV3' ? metadata.attachments : [];
  const audioAttachement =
    metadata.__typename === 'AudioMetadataV3' && metadata.asset;
  const videoAttachment =
    metadata.__typename === 'VideoMetadataV3' && metadata.asset;

  const attachmentsLength = imageAttachments?.length ?? 0;

  return (
    <div className={cn(getClass(attachmentsLength)?.row, 'mt-3 grid gap-2')}>
      {metadata.__typename}
      {imageAttachments ? (
        imageAttachments.map((attachment, index) => {
          const isImage =
            attachment.__typename === 'PublicationMetadataMediaImage';

          if (!isImage) {
            return null;
          }

          return (
            <div
              key={index}
              className={cn(
                isImage
                  ? `${getClass(attachmentsLength)?.aspect} ${
                      attachmentsLength === 3 && index === 0 ? 'row-span-2' : ''
                    }`
                  : '',
                { 'w-2/3': isImage && attachmentsLength === 1 },
                'relative'
              )}
              onClick={stopEventPropagation}
              aria-hidden="true"
            >
              <Image
                className="cursor-pointer rounded-lg border bg-gray-100 object-cover dark:border-gray-700 dark:bg-gray-800"
                loading="lazy"
                height={1000}
                width={1000}
                onError={({ currentTarget }) => {
                  currentTarget.src = attachment.image?.optimized?.uri;
                }}
                onClick={() => {
                  setExpandedImage(attachment.image?.optimized?.uri);
                  Leafwatch.track(PUBLICATION.ATTACHMENT.IMAGE.OPEN, {
                    publication_id: publication?.id
                  });
                }}
                src={imageKit(attachment.image.optimized?.uri, ATTACHMENT)}
                alt={imageKit(attachment.image.optimized?.uri, ATTACHMENT)}
                data-testid={`attachment-image-${attachment.image.optimized?.uri}`}
              />
            </div>
          );
        })
      ) : videoAttachment ? (
        <Video
          src={videoAttachment.video.optimized?.uri}
          poster={videoAttachment.cover?.optimized?.uri}
        />
      ) : audioAttachement ? (
        <Audio
          src={audioAttachement.audio?.optimized?.uri}
          isNew={false}
          publication={publication}
          expandCover={(url) => setExpandedImage(url)}
        />
      ) : null}
      <LightBox
        show={Boolean(expandedImage)}
        url={expandedImage}
        onClose={() => setExpandedImage(null)}
      />
    </div>
  );
};

export default Attachments;
