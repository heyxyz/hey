import ChooseThumbnail from '@components/Composer/ChooseThumbnail';
import {
  ArrowTopRightOnSquareIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import {
  ALLOWED_AUDIO_TYPES,
  ALLOWED_VIDEO_TYPES,
  ATTACHMENT
} from '@hey/data/constants';
import { PUBLICATION } from '@hey/data/tracking';
import type { MediaSet, Publication } from '@hey/lens';
import getThumbnailUrl from '@hey/lib/getThumbnailUrl';
import imageKit from '@hey/lib/imageKit';
import sanitizeDStorageUrl from '@hey/lib/sanitizeDStorageUrl';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import type { NewAttachment } from '@hey/types/misc';
import { Button, Image, LightBox } from '@hey/ui';
import cn from '@hey/ui/cn';
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
  publication?: Publication;
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
  const uploadedPercentage = usePublicationStore(
    (state) => state.uploadedPercentage
  );
  const isUploading = usePublicationStore((state) => state.isUploading);
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

  const slicedAttachments = attachments?.some((e: any) =>
    ALLOWED_VIDEO_TYPES.includes(e?.original?.mimeType)
  )
    ? attachments?.slice(0, 1)
    : attachments?.slice(0, 4);
  const attachmentsLength = slicedAttachments?.length;

  return attachmentsLength !== 0 ? (
    <>
      <div className={cn(getClass(attachmentsLength)?.row, 'mt-3 grid gap-2')}>
        {slicedAttachments?.map(
          (attachment: NewAttachment & MediaSet, index: number) => {
            const type = attachment.original?.mimeType;
            const url = isNew
              ? attachment.previewItem
              : sanitizeDStorageUrl(attachment.original?.url);
            const isAudio = ALLOWED_AUDIO_TYPES.includes(type);
            const isVideo = ALLOWED_VIDEO_TYPES.includes(type);
            const isImage = !(isVideo || isAudio);

            return (
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
                key={index + url}
                onClick={stopEventPropagation}
                aria-hidden="true"
              >
                {type === 'image/svg+xml' ? (
                  <Button
                    className="text-sm"
                    variant="primary"
                    icon={<ArrowTopRightOnSquareIcon className="h-4 w-4" />}
                    onClick={() => window.open(url, '_blank')}
                  >
                    <span>
                      <Trans>Open Image in new tab</Trans>
                    </span>
                  </Button>
                ) : isVideo ? (
                  isNew ? (
                    <>
                      {isUploading && uploadedPercentage !== 100 ? (
                        <div className="mb-5 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                          <div
                            className="bg-brand-500 h-2.5 rounded-full"
                            style={{ width: `${uploadedPercentage}%` }}
                          />
                        </div>
                      ) : null}
                      <video
                        className="w-full overflow-hidden rounded-xl"
                        src={url}
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
                      src={url}
                      poster={getThumbnailUrl(publication?.metadata)}
                    />
                  )
                ) : isAudio ? (
                  <Audio
                    src={url}
                    isNew={isNew}
                    publication={publication}
                    txn={txn}
                    expandCover={(url) => setExpandedImage(url)}
                  />
                ) : (
                  <Image
                    className="cursor-pointer rounded-lg border bg-gray-100 object-cover dark:border-gray-700 dark:bg-gray-800"
                    loading="lazy"
                    height={1000}
                    width={1000}
                    onError={({ currentTarget }) => {
                      currentTarget.src = url;
                    }}
                    onClick={() => {
                      setExpandedImage(url);
                      Leafwatch.track(PUBLICATION.ATTACHMENT.IMAGE.OPEN, {
                        publication_id: publication?.id
                      });
                    }}
                    src={isNew ? url : imageKit(url, ATTACHMENT)}
                    alt={isNew ? url : imageKit(url, ATTACHMENT)}
                    data-testid={`attachment-image-${url}`}
                  />
                )}
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
      <LightBox
        show={Boolean(expandedImage)}
        url={expandedImage}
        onClose={() => setExpandedImage(null)}
      />
    </>
  ) : null;
};

export default Attachments;
