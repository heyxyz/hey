import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import {
  MusicalNoteIcon,
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { Spinner, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import useUploadAttachments from '@hooks/useUploadAttachments';
import {
  MediaAudioMimeType,
  MediaImageMimeType
} from '@lens-protocol/metadata';
import { usePublicationStore } from '@store/non-persisted/usePublicationStore';
import { motion } from 'framer-motion';
import type { ChangeEvent, FC } from 'react';
import { useId, useRef, useState } from 'react';
import toast from 'react-hot-toast';
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
  const attachments = usePublicationStore((state) => state.attachments);
  const isUploading = usePublicationStore((state) => state.isUploading);
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
    } else {
      return files.length === 1;
    }
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

  return (
    <Menu as="div">
      <Menu.Button
        as={motion.button}
        className="outline-brand-500 rounded-full outline-offset-8"
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowMenu(!showMenu)}
        aria-label="More"
      >
        {isUploading ? (
          <Spinner size="sm" />
        ) : (
          <Tooltip placement="top" content="Media">
            <PhotoIcon className="text-brand-500 h-5 w-5" />
          </Tooltip>
        )}
      </Menu.Button>
      <MenuTransition show={showMenu}>
        <Menu.Items
          ref={dropdownRef}
          className="absolute z-[5] mt-2 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
          static
        >
          <Menu.Item
            as="label"
            disabled={disableImageUpload()}
            className={({ active }) =>
              cn(
                { 'dropdown-active': active },
                'menu-item !flex cursor-pointer items-center gap-1 space-x-1 rounded-lg'
              )
            }
            htmlFor={`image_${id}`}
          >
            <PhotoIcon className="text-brand-500 h-4 w-4" />
            <span className="text-sm">Upload image(s)</span>
            <input
              id={`image_${id}`}
              type="file"
              multiple
              accept={ImageMimeType.join(',')}
              className="hidden"
              onChange={handleAttachment}
              disabled={disableImageUpload()}
            />
          </Menu.Item>
          <Menu.Item
            as="label"
            disabled={Boolean(attachments.length)}
            className={({ active }) =>
              cn(
                { 'dropdown-active': active },
                'menu-item !flex cursor-pointer items-center gap-1 space-x-1 rounded-lg'
              )
            }
            htmlFor={`video_${id}`}
          >
            <VideoCameraIcon className="text-brand-500 h-4 w-4" />
            <span className="text-sm">Upload video</span>
            <input
              id={`video_${id}`}
              type="file"
              accept={VideoMimeType.join(',')}
              className="hidden"
              onChange={handleAttachment}
              disabled={Boolean(attachments.length)}
            />
          </Menu.Item>
          <Menu.Item
            disabled={Boolean(attachments.length)}
            as="label"
            className={({ active }) =>
              cn(
                { 'dropdown-active': active },
                'menu-item !flex cursor-pointer items-center gap-1 space-x-1 rounded-lg'
              )
            }
            htmlFor={`audio_${id}`}
          >
            <MusicalNoteIcon className="text-brand-500 h-4 w-4" />
            <span className="text-sm">Upload audio</span>
            <input
              id={`audio_${id}`}
              type="file"
              accept={AudioMimeType.join(',')}
              className="hidden"
              onChange={handleAttachment}
              disabled={Boolean(attachments.length)}
            />
          </Menu.Item>
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default Attachment;
