import { Button } from '@components/UI/Button';
import { LightBox } from '@components/UI/LightBox';
import type { NewLensterAttachment } from '@generated/types';
import { ExternalLinkIcon, XIcon } from '@heroicons/react/outline';
import { Analytics } from '@lib/analytics';
import getIPFSLink from '@lib/getIPFSLink';
import imageProxy from '@lib/imageProxy';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import { ALLOWED_AUDIO_TYPES, ALLOWED_VIDEO_TYPES, ATTACHMENT } from 'data/constants';
import type { MediaSet, Publication } from 'lens';
import type { FC } from 'react';
import { useState } from 'react';
import { usePublicationStore } from 'src/store/publication';
import { PUBLICATION } from 'src/tracking';

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

interface Props {
  attachments: any;
  isNew?: boolean;
  hideDelete?: boolean;
  publication?: Publication;
  txn?: any;
}

const Attachments: FC<Props> = ({
  attachments = [],
  isNew = false,
  hideDelete = false,
  publication,
  txn
}) => {
  const setAttachments = usePublicationStore((state) => state.setAttachments);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const removeAttachment = (attachment: any) => {
    const arr = attachments;
    setAttachments(
      arr.filter(function (ele: any) {
        return ele != attachment;
      })
    );
  };

  const getCoverUrl = () => {
    return publication?.metadata?.cover?.original.url || publication?.metadata?.image;
  };

  const slicedAttachments = isNew
    ? attachments?.slice(0, 4)
    : attachments?.some((e: any) => ALLOWED_VIDEO_TYPES.includes(e?.original?.mimeType))
    ? attachments?.slice(0, 1)
    : attachments?.slice(0, 4);

  return slicedAttachments?.length !== 0 ? (
    <>
      <div className={clsx(getClass(slicedAttachments?.length)?.row, 'grid gap-2 pt-3')}>
        {slicedAttachments?.map((attachment: NewLensterAttachment & MediaSet, index: number) => {
          const type = isNew ? attachment.type : attachment.original?.mimeType;
          const url = isNew
            ? attachment.previewItem || getIPFSLink(attachment.item!)
            : getIPFSLink(attachment.original?.url) || getIPFSLink(attachment.item!);

          return (
            <div
              className={clsx(
                ALLOWED_VIDEO_TYPES.includes(type) || ALLOWED_AUDIO_TYPES.includes(type)
                  ? ''
                  : `${getClass(slicedAttachments?.length, isNew)?.aspect} ${
                      slicedAttachments?.length === 3 && index === 0 ? 'row-span-2' : ''
                    }`,
                {
                  'w-full': ALLOWED_AUDIO_TYPES.includes(type),
                  'w-2/3':
                    ALLOWED_VIDEO_TYPES.includes(type) ||
                    (slicedAttachments.length === 1 && !ALLOWED_AUDIO_TYPES.includes(type))
                },
                'relative'
              )}
              key={index + url}
              onClick={(event) => {
                event.stopPropagation();
              }}
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
              ) : ALLOWED_VIDEO_TYPES.includes(type) ? (
                <Video src={url} poster={getCoverUrl()} />
              ) : ALLOWED_AUDIO_TYPES.includes(type) ? (
                <Audio src={url} isNew={isNew} publication={publication} txn={txn} />
              ) : (
                <img
                  className="object-cover bg-gray-100 rounded-lg border cursor-pointer dark:bg-gray-800 dark:border-gray-700"
                  loading="lazy"
                  height={1000}
                  width={1000}
                  onError={({ currentTarget }) => {
                    currentTarget.src = url;
                  }}
                  onClick={() => {
                    setExpandedImage(url);
                    Analytics.track(PUBLICATION.ATTACHEMENT.IMAGE.OPEN);
                  }}
                  src={isNew ? url : imageProxy(url, ATTACHMENT)}
                  alt={isNew ? url : imageProxy(url, ATTACHMENT)}
                />
              )}
              {isNew && !hideDelete && (
                <div
                  className={clsx(ALLOWED_AUDIO_TYPES.includes(type) ? 'absolute -top-2.5 -left-2' : 'm-3')}
                >
                  <button
                    type="button"
                    className="p-1.5 bg-gray-900 rounded-full opacity-75"
                    onClick={() => removeAttachment(attachment)}
                  >
                    <XIcon className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <LightBox show={Boolean(expandedImage)} url={expandedImage} onClose={() => setExpandedImage(null)} />
    </>
  ) : null;
};

export default Attachments;
