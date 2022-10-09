import { Button } from '@components/UI/Button';
import { LightBox } from '@components/UI/LightBox';
import type { LensterAttachment } from '@generated/lenstertypes';
import type { MediaSet } from '@generated/types';
import { ExternalLinkIcon, XIcon } from '@heroicons/react/outline';
import getIPFSLink from '@lib/getIPFSLink';
import imagekitURL from '@lib/imagekitURL';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import type { FC } from 'react';
import { useState } from 'react';

const Video = dynamic(() => import('./Video'), {
  loading: () => <div className="rounded-lg aspect-w-16 aspect-h-12 shimmer" />
});

const getClass = (attachments: number, isNew = false) => {
  console.log(isNew);
  if (attachments === 1) {
    return {
      aspect: isNew ? 'aspect-w-16 aspect-h-12' : '',
      row: 'grid-cols-1 grid-rows-1 w-2/3'
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
  setAttachments?: any;
  isNew?: boolean;
  hideDelete?: boolean;
}

const Attachments: FC<Props> = ({ attachments, setAttachments, isNew = false, hideDelete = false }) => {
  const [expanedImage, setExpandedImage] = useState<string | null>(null);

  const removeAttachment = (attachment: any) => {
    const arr = attachments;
    setAttachments(
      arr.filter(function (ele: any) {
        return ele != attachment;
      })
    );
  };

  const slicedAttachments = isNew
    ? attachments?.slice(0, 4)
    : attachments?.some((e: any) => e.original.mimeType === 'video/mp4')
    ? attachments?.slice(0, 1)
    : attachments?.slice(0, 4);

  return slicedAttachments?.length !== 0 ? (
    <>
      <div className={clsx(getClass(slicedAttachments?.length)?.row, 'grid grid-flow-col gap-2 pt-3')}>
        {slicedAttachments?.map((attachment: LensterAttachment & MediaSet) => {
          const type = isNew ? attachment.type : attachment.original.mimeType;
          const url = isNew ? getIPFSLink(attachment.item) : getIPFSLink(attachment.original.url);

          return (
            <div
              className={clsx(type === 'video/mp4' ? '' : getClass(slicedAttachments?.length, isNew)?.aspect)}
              key={url}
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              {type === 'image/svg+xml' ? (
                <Button
                  className="text-sm"
                  variant="primary"
                  icon={<ExternalLinkIcon className="h-4 w-4" />}
                  onClick={() => {
                    window.open(url, '_blank');
                  }}
                >
                  <span>Open Image in new tab</span>
                </Button>
              ) : type === 'video/mp4' ? (
                <Video src={url} />
              ) : (
                <img
                  className="object-cover bg-gray-100 rounded-lg border cursor-pointer dark:bg-gray-800 dark:border-gray-700/80"
                  loading="lazy"
                  onClick={() => setExpandedImage(url)}
                  src={imagekitURL(url, 'attachment')}
                  alt={imagekitURL(url, 'attachment')}
                />
              )}
              {isNew && !hideDelete && (
                <div className="m-3">
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
      <LightBox show={!!expanedImage} url={expanedImage} onClose={() => setExpandedImage(null)} />
    </>
  ) : null;
};

export default Attachments;
