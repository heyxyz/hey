import { LensterAttachment } from '@generated/lenstertypes';
import { MediaSet } from '@generated/types';
import { XIcon } from '@heroicons/react/outline';
import getIPFSLink from '@lib/getIPFSLink';
import imagekitURL from '@lib/imagekitURL';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import React, { FC, MouseEvent } from 'react';

const Video = dynamic(() => import('./Video'), {
  loading: () => <div className="rounded-lg aspect-w-16 aspect-h-12 shimmer" />
});

const getClass = (attachments: number) => {
  if (attachments === 1) {
    return {
      aspect: '',
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

type Attachment = LensterAttachment | MediaSet;
interface Props {
  attachments: Attachment[];
  setAttachments?: (attachments: Attachment[]) => void;
  isNew?: boolean;
}

const Attachments: FC<Props> = ({ attachments, setAttachments, isNew = false }) => {
  const removeAttachment = (attachment: Attachment) => {
    const arr = attachments;
    if (typeof setAttachments === 'function') {
      setAttachments(
        arr.filter(function (ele: Attachment) {
          return ele != attachment;
        })
      );
    }
  };

  const slicedAttachments = isNew
    ? attachments?.slice(0, 4)
    : attachments?.some((e: Attachment) => (e as MediaSet).original.mimeType === 'video/mp4')
    ? attachments?.slice(0, 1)
    : attachments?.slice(0, 4);

  return slicedAttachments?.length !== 0 ? (
    <div
      className={clsx(getClass(slicedAttachments?.length)?.row, 'grid grid-flow-col gap-2 pt-3')}
      onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
    >
      {slicedAttachments?.map((attachment: Attachment) => {
        const type = isNew
          ? (attachment as LensterAttachment).type
          : (attachment as MediaSet).original.mimeType;
        const url = isNew
          ? getIPFSLink((attachment as LensterAttachment).item)
          : getIPFSLink((attachment as MediaSet).original.url);

        return (
          <div
            className={clsx(type === 'video/mp4' ? '' : getClass(slicedAttachments?.length)?.aspect)}
            key={url}
          >
            {type === 'video/mp4' ? (
              <Video src={url} />
            ) : (
              <img
                className="object-cover bg-gray-100 rounded-lg border cursor-pointer dark:bg-gray-800 dark:border-gray-700/80"
                loading="lazy"
                onClick={() => window.open(url, '_blank')}
                src={imagekitURL(url, 'attachment')}
                alt={imagekitURL(url, 'attachment')}
              />
            )}
            {isNew && (
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
  ) : null;
};

export default Attachments;
