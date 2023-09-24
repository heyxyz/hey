import ChooseThumbnail from '@components/Composer/ChooseThumbnail';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { PublicationMetadataMedia } from '@lenster/lens';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import type { NewLensterAttachment } from '@lenster/types/misc';
import { Button, Image } from '@lenster/ui';
import cn from '@lenster/ui/cn';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useRef } from 'react';
import { usePublicationStore } from 'src/store/publication';
import { useUpdateEffect } from 'usehooks-ts';

import Audio from './Audio';

const getClass = (attachments: number) => {
  if (attachments === 1) {
    return {
      aspect: 'aspect-w-16 aspect-h-10',
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

interface NewAttachmentsProps {
  attachments: any;
  hideDelete?: boolean;
  txn?: any;
}

const NewAttachments: FC<NewAttachmentsProps> = ({
  attachments = [],
  hideDelete = false,
  txn
}) => {
  const setAttachments = usePublicationStore((state) => state.setAttachments);
  const setVideoDurationInSeconds = usePublicationStore(
    (state) => state.setVideoDurationInSeconds
  );
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
    <div className={cn(getClass(attachmentsLength)?.row, 'mt-3 grid gap-2')}>
      {slicedAttachments?.map(
        (attachment: NewLensterAttachment, index: number) => {
          const isAudio =
            attachment.__typename === 'PublicationMetadataMediaAudio';
          const isVideo =
            attachment.__typename === 'PublicationMetadataMediaVideo';
          const isImage =
            attachment.__typename === 'PublicationMetadataMediaImage';

          return (
            <div
              className={cn(
                isImage
                  ? `${getClass(attachmentsLength)?.aspect} ${
                      attachmentsLength === 3 && index === 0 ? 'row-span-2' : ''
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
                <>
                  <video
                    className="w-full overflow-hidden rounded-xl"
                    src={attachment.previewItem}
                    ref={videoRef}
                    disablePictureInPicture
                    disableRemotePlayback
                    controlsList="nodownload noplaybackrate"
                    controls
                  />
                  <ChooseThumbnail />
                </>
              ) : isAudio ? (
                <Audio
                  src={attachment.previewItem}
                  isNew
                  txn={txn}
                  expandCover={() => {}}
                />
              ) : isImage ? (
                <Image
                  className="cursor-pointer rounded-lg border bg-gray-100 object-cover dark:border-gray-700 dark:bg-gray-800"
                  loading="lazy"
                  height={1000}
                  width={1000}
                  onError={({ currentTarget }) => {
                    currentTarget.src = attachment.previewItem;
                  }}
                  src={attachment.previewItem}
                  alt={attachment.previewItem}
                />
              ) : null}
              {!hideDelete &&
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
                    className={cn(isAudio ? 'absolute left-2 top-2' : 'm-3')}
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
          );
        }
      )}
    </div>
  ) : null;
};

export default NewAttachments;
