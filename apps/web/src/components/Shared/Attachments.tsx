import ChooseThumbnail from '@components/Composer/ChooseThumbnail';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ATTACHMENT } from '@lenster/data/constants';
import { PUBLICATION } from '@lenster/data/tracking';
import type { AnyPublication, PublicationMetadataMedia } from '@lenster/lens';
import imageKit from '@lenster/lib/imageKit';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import type { NewLensterAttachment } from '@lenster/types/misc';
import { Button, Image, LightBox } from '@lenster/ui';
import cn from '@lenster/ui/cn';
import { Leafwatch } from '@lib/leafwatch';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useRef, useState } from 'react';
import { usePublicationStore } from 'src/store/publication';
import { useUpdateEffect } from 'usehooks-ts';

import Audio from './Audio';
import Video from './Video';

const getClass = (attachments: number, isNew = false) => {
  if (attachments === 1) {
    return {
      aspect: isNew ? 'aspect-w-16 aspect-h-10' : '',
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
  attachments: any;
  isNew?: boolean;
  hideDelete?: boolean;
  publication?: AnyPublication;
  txn?: any;
}

const Attachments: FC<AttachmentsProps> = ({
  attachments = [],
  isNew = false,
  hideDelete = false,
  publication,
  txn
}) => {
  const setAttachments = usePublicationStore((state) => state.setAttachments);
  const setVideoDurationInSeconds = usePublicationStore(
    (state) => state.setVideoDurationInSeconds
  );
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onDataLoaded = () => {
    if (videoRef.current?.duration && videoRef.current?.duration !== Infinity) {
      setVideoDurationInSeconds(videoRef.current.duration.toFixed(2));
    }
  };

  useUpdateEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadeddata = onDataLoaded;
    }
  }, [videoRef, attachments]);

  const removeAttachment = (attachment: any) => {
    const arr = attachments;
    setAttachments(
      arr.filter((element: any) => {
        return element !== attachment;
      })
    );
  };

  const slicedAttachments = attachments?.some(
    (attachment: PublicationMetadataMedia) =>
      attachment.__typename === 'PublicationMetadataMediaVideo' ||
      attachment.__typename === 'PublicationMetadataMediaAudio'
  )
    ? attachments?.slice(0, 1)
    : attachments?.slice(0, 4);
  const attachmentsLength = slicedAttachments?.length;

  return attachmentsLength !== 0 ? (
    <>
      <div className={cn(getClass(attachmentsLength)?.row, 'mt-3 grid gap-2')}>
        {slicedAttachments?.map(
          (
            attachment: PublicationMetadataMedia | NewLensterAttachment,
            index: number
          ) => {
            const newAttachment = attachment as NewLensterAttachment;
            const publicationAttachment =
              attachment as PublicationMetadataMedia;

            const isAudio =
              publicationAttachment.__typename ===
              'PublicationMetadataMediaAudio';
            const isVideo =
              publicationAttachment.__typename ===
              'PublicationMetadataMediaVideo';
            const isImage =
              publicationAttachment.__typename ===
              'PublicationMetadataMediaImage';

            return (
              <>
                {JSON.stringify(publicationAttachment)}
                <div
                  className={cn(
                    isImage
                      ? `${getClass(attachmentsLength, isNew)?.aspect} ${
                          attachmentsLength === 3 && index === 0
                            ? 'row-span-2'
                            : ''
                        }`
                      : '',
                    {
                      'w-full': isAudio || isVideo,
                      'w-2/3': isImage && attachmentsLength === 1
                    },
                    'relative'
                  )}
                  key={index}
                  onClick={stopEventPropagation}
                  aria-hidden="true"
                >
                  {isVideo ? (
                    isNew ? (
                      <>
                        <video
                          className="w-full overflow-hidden rounded-xl"
                          src={newAttachment.previewItem}
                          ref={videoRef}
                          disablePictureInPicture
                          disableRemotePlayback
                          controlsList="nodownload noplaybackrate"
                          controls
                        />
                        <ChooseThumbnail />
                      </>
                    ) : (
                      <Video
                        src={publicationAttachment.video.optimized?.uri}
                        poster={publicationAttachment.cover?.optimized?.uri}
                      />
                    )
                  ) : isAudio ? (
                    <Audio
                      src={
                        isNew
                          ? newAttachment.uploaded.uri
                          : publicationAttachment.audio?.optimized?.uri
                      }
                      isNew={isNew}
                      publication={publication}
                      txn={txn}
                      expandCover={(url) => setExpandedImage(url)}
                    />
                  ) : isImage ? (
                    <Image
                      className="cursor-pointer rounded-lg border bg-gray-100 object-cover dark:border-gray-700 dark:bg-gray-800"
                      loading="lazy"
                      height={1000}
                      width={1000}
                      onError={({ currentTarget }) => {
                        currentTarget.src = isNew
                          ? newAttachment.previewItem
                          : publicationAttachment.image?.optimized?.uri;
                      }}
                      onClick={() => {
                        setExpandedImage(
                          isNew
                            ? newAttachment.previewItem
                            : publicationAttachment.image?.optimized?.uri
                        );
                        Leafwatch.track(PUBLICATION.ATTACHMENT.IMAGE.OPEN, {
                          publication_id: publication?.id
                        });
                      }}
                      src={
                        isNew
                          ? newAttachment.previewItem
                          : imageKit(
                              publicationAttachment.image.optimized?.uri,
                              ATTACHMENT
                            )
                      }
                      alt={
                        isNew
                          ? newAttachment.previewItem
                          : imageKit(
                              publicationAttachment.image.optimized?.uri,
                              ATTACHMENT
                            )
                      }
                      data-testid={`attachment-image-${
                        !isNew ? publicationAttachment.image.optimized?.uri : ''
                      }`}
                    />
                  ) : null}
                  {isNew &&
                    !hideDelete &&
                    (isVideo ? (
                      <Button
                        className="mt-3"
                        variant="danger"
                        size="sm"
                        icon={<XMarkIcon className="h-4 w-4" />}
                        onClick={() => removeAttachment(attachment)}
                        outline
                      >
                        <Trans>Cancel Upload</Trans>
                      </Button>
                    ) : (
                      <div
                        className={cn(
                          isAudio ? 'absolute left-2 top-2' : 'm-3'
                        )}
                      >
                        <button
                          type="button"
                          className="rounded-full bg-gray-900 p-1.5 opacity-75"
                          onClick={() => removeAttachment(attachment)}
                        >
                          <XMarkIcon className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    ))}
                </div>
              </>
            );
          }
        )}
      </div>
      <LightBox
        show={Boolean(expandedImage)}
        url={expandedImage}
        onClose={() => setExpandedImage(null)}
      />
    </>
  ) : null;
};

export default Attachments;
