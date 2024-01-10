import type { ChangeEvent, FC } from 'react';

import {
  MusicalNoteIcon,
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { Spinner, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import {
  MediaAudioMimeType,
  MediaImageMimeType
} from '@lens-protocol/metadata';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion } from 'framer-motion';
import { useId, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import useUploadAttachments from 'src/hooks/useUploadAttachments';
import { usePublicationAttachmentStore } from 'src/store/non-persisted/publication/usePublicationAttachmentStore';
import { useOnClickOutside } from 'usehooks-ts';

const ImageMimeType = Object.values(MediaImageMimeType);
const AudioMimeType = Object.values(MediaAudioMimeType);
const VideoMimeType = [
  'video/mp4',
  'video/mpeg',
  'video/ogg',
  'video/webm',
  'video/quicktime'
];

const Attachment: FC = () => {
  const attachments = usePublicationAttachmentStore(
    (state) => state.attachments
  );
  const isUploading = usePublicationAttachmentStore(
    (state) => state.isUploading
  );
  const { handleUploadAttachments } = useUploadAttachments();
  const [showMenu, setShowMenu] = useState(false);
  const id = useId();
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setShowMenu(false));

  const isTypeAllowed = (files: FileList) => {
    const allowedTypes = [
      ...ImageMimeType,
      ...AudioMimeType,
      ...VideoMimeType
    ] as string[];

    for (const file of files) {
      if (allowedTypes.includes(file.type)) {
        return true;
      }
    }

    return false;
  };

  const isUploadAllowed = (files: FileList) => {
    if (files[0]?.type.slice(0, 5) === 'image') {
      return attachments.length + files.length <= 4;
    }

    return files.length === 1;
  };

  const disableImageUpload = () => {
    const notImage = attachments[0] && attachments[0].type !== 'Image';
    const isLimit = !notImage && attachments.length >= 4;
    return notImage || isLimit;
  };

  const handleAttachment = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setShowMenu(false);

    try {
      const { files } = evt.target;
      if (!isUploadAllowed(files as FileList)) {
        toast.error('Exceeded max limit of 1 audio, or 1 video, or 4 images');
        return;
      }
      if (isTypeAllowed(files as FileList)) {
        await handleUploadAttachments(files);
        evt.target.value = '';
      } else {
        return toast.error('File format not allowed.');
      }
    } catch {
      toast.error('Something went wrong while uploading!');
    }
  };

  const preventDefaultEvent = (e: Event) => {
    e.preventDefault();
  };

  return (
    <DropdownMenu.Root modal={false} onOpenChange={setShowMenu} open={showMenu}>
      <div>
        <DropdownMenu.Trigger asChild>
          <motion.button
            aria-label="More"
            className="outline-brand-500 rounded-full outline-offset-8"
            whileTap={{ scale: 0.9 }}
          >
            {isUploading ? (
              <Spinner size="sm" />
            ) : (
              <Tooltip content="Media" placement="top">
                <PhotoIcon className="text-brand-500 size-5" />
              </Tooltip>
            )}
          </motion.button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          align={'start'}
          className="menu-transition absolute z-[5] mt-2 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          ref={dropdownRef}
        >
          <DropdownMenu.Item
            className="menu-item rounded-lg focus:outline-none  data-[disabled]:cursor-default data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800"
            disabled={disableImageUpload()}
            onSelect={preventDefaultEvent}
          >
            <label
              className={cn(
                { 'cursor-pointer': !disableImageUpload() },
                { 'cursor-default': disableImageUpload() },
                '!flex items-center gap-1 space-x-1'
              )}
              htmlFor={`image_${id}`}
            >
              <PhotoIcon className="text-brand-500 size-5" />
              <span className="text-sm">Upload image(s)</span>

              <input
                accept={ImageMimeType.join(',')}
                className="hidden"
                disabled={disableImageUpload()}
                id={`image_${id}`}
                multiple
                onChange={handleAttachment}
                type="file"
              />
            </label>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="menu-item rounded-lg focus:outline-none data-[disabled]:cursor-default data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800"
            disabled={Boolean(attachments.length)}
            onSelect={preventDefaultEvent}
          >
            <label
              className={cn(
                { 'cursor-pointer': !Boolean(attachments.length) },
                { 'cursor-default': Boolean(attachments.length) },
                '!flex items-center gap-1 space-x-1'
              )}
              htmlFor={`video_${id}`}
            >
              <VideoCameraIcon className="text-brand-500 size-5" />
              <span className="text-sm">Upload video</span>

              <input
                accept={VideoMimeType.join(',')}
                className="hidden"
                disabled={Boolean(attachments.length)}
                id={`video_${id}`}
                onChange={handleAttachment}
                type="file"
              />
            </label>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="menu-item rounded-lg focus:outline-none data-[disabled]:cursor-default data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-800"
            disabled={Boolean(attachments.length)}
            onSelect={preventDefaultEvent}
          >
            <label
              className={cn(
                { 'cursor-pointer': !Boolean(attachments.length) },
                { 'cursor-default': Boolean(attachments.length) },
                '!flex items-center gap-1 space-x-1'
              )}
              htmlFor={`audio_${id}`}
            >
              <MusicalNoteIcon className="text-brand-500 size-4" />
              <span className="text-sm">Upload audio</span>
              <input
                accept={AudioMimeType.join(',')}
                className="hidden"
                disabled={Boolean(attachments.length)}
                id={`audio_${id}`}
                onChange={handleAttachment}
                type="file"
              />
            </label>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </div>
    </DropdownMenu.Root>
  );
};

export default Attachment;
