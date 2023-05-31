import ChooseThumbnail from '@components/Composer/ChooseThumbnail';
import { ExternalLinkIcon, XIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import {
  ALLOWED_AUDIO_TYPES,
  ALLOWED_VIDEO_TYPES,
  ATTACHMENT,
  STATIC_IMAGES_URL
} from 'data/constants';
import type { MediaSet, Publication } from 'lens';
import imageKit from 'lib/imageKit';
import sanitizeDStorageUrl from 'lib/sanitizeDStorageUrl';
import stopEventPropagation from 'lib/stopEventPropagation';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { usePublicationStore } from 'src/store/publication';
import { PUBLICATION } from 'src/tracking';
import type { NewLensterAttachment } from 'src/types';
import { Button, Image, LightBox } from 'ui';

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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.onloadeddata = onDataLoaded;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoRef, attachments]);

  const removeAttachment = (attachment: any) => {
    const arr = attachments;
    setAttachments(
      arr.filter((element: any) => {
        return element !== attachment;
      })
    );
  };

  const getThumbnailUrl = () => {
    const metadata = publication?.metadata;
    const hasNoThumbnail = metadata?.media[0].original.url === metadata?.image;

    if (hasNoThumbnail) {
      return `${STATIC_IMAGES_URL}/thumbnail.png`;
    }

    return (
      metadata?.cover?.original.url ||
      metadata?.image ||
      `${STATIC_IMAGES_URL}/thumbnail.png`
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
      <div
        className={clsx(getClass(attachmentsLength)?.row, 'mt-3 grid gap-2')}
      >
        {slicedAttachments?.map(
          (attachment: NewLensterAttachment & MediaSet, index: number) => {
            const type = attachment.original?.mimeType;
            const url = isNew
              ? attachment.previewItem
              : sanitizeDStorageUrl(attachment.original?.url);
            const isAudio = ALLOWED_AUDIO_TYPES.includes(type);
            const isVideo = ALLOWED_VIDEO_TYPES.includes(type);
            const isImage = !(isVideo || isAudio);

            return (
              <div
                className={clsx(
                  isImage
                    ? `${getClass(attachmentsLength, isNew)?.aspect} ${
                        attachmentsLength === 3 && index === 0
                          ? 'row-span-2'
                          : ''
                      }`
                    : '',
                  {
                    'w-full': isAudio || isVideo,
                    'w-2/3': !isVideo && attachmentsLength === 1
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
                    icon={<ExternalLinkIcon className="h-4 w-4" />}
                    onClick={() => window.open(url, '_blank')}
                  >
                    <span>
                      <Trans>Open Image in new tab</Trans>
                    </span>
                  </Button>
                ) : isVideo ? (
                  isNew ? (
                    <>
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
                    <Video src={url} poster={getThumbnailUrl()} />
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
                      Leafwatch.track(PUBLICATION.ATTACHMENT.IMAGE.OPEN);
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
                      icon={<XIcon className="h-4 w-4" />}
                      onClick={() => removeAttachment(attachment)}
                      outline
                    >
                      <Trans>Cancel Upload</Trans>
                    </Button>
                  ) : (
                    <div
                      className={clsx(
                        isAudio ? 'absolute left-2 top-2' : 'm-3'
                      )}
                    >
                      <button
                        type="button"
                        className="rounded-full bg-gray-900 p-1.5 opacity-75"
                        onClick={() => removeAttachment(attachment)}
                      >
                        <XIcon className="h-4 w-4 text-white" />
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
