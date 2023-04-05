import MenuTransition from '@components/Shared/MenuTransition';
import useOnClickOutside from '@components/utils/hooks/useOnClickOutside';
import useUploadAttachments from '@components/utils/hooks/useUploadAttachments';
import { Menu } from '@headlessui/react';
import { MusicNoteIcon, PhotographIcon, VideoCameraIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import {
  ALLOWED_AUDIO_TYPES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_MEDIA_TYPES,
  ALLOWED_VIDEO_TYPES
} from 'data/constants';
import type { ChangeEvent, FC } from 'react';
import { Fragment, useId, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { usePublicationStore } from 'src/store/publication';
import type { NewLensterAttachment } from 'src/types';
import { Spinner, Tooltip } from 'ui';

interface AttachmentProps {
  attachments: NewLensterAttachment[];
}

const Attachment: FC<AttachmentProps> = ({ attachments }) => {
  const isUploading = usePublicationStore((state) => state.isUploading);
  const { handleUploadAttachments } = useUploadAttachments();
  const [showMenu, setShowMenu] = useState(false);
  const [limitReached, toggleLimitReached] = useState(false);
  const [isImageAttachmentType, setIsImageAttachmentType] = useState(false);
  const id = useId();
  const dropdownRef = useRef(null);
  const [prevItems, setPrevItems] = useState(attachments);

  //Clear media upload limits if attachments are empty
  if (attachments !== prevItems && !attachments.length) {
    setPrevItems(attachments);
    toggleLimitReached(false);
    setIsImageAttachmentType(false);
  }

  useOnClickOutside(dropdownRef, () => setShowMenu(false));

  const isTypeAllowed = (files: FileList) => {
    for (const file of files) {
      if (ALLOWED_MEDIA_TYPES.includes(file.type)) {
        return true;
      }
    }

    return false;
  };

  const mediaLimitReached = (files: FileList) => {
    //gets type of media through first 5 letters of type (media || video || audio)
    const mediaType = files[0].type.substring(0, 5);

    //If image limit reach toggle flag to disabled additional uploads
    switch (mediaType) {
      case 'image':
        setIsImageAttachmentType(true);
        break;
      default:
        toggleLimitReached(true);
    }

    //Set limit flag if 4 images to post
    if (mediaType === 'image' && attachments.length === 3) {
      toggleLimitReached(true);
    }
  };

  const handleAttachment = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setShowMenu(false);

    try {
      const { files } = evt.target;
      files && mediaLimitReached(files);
      // Count check
      if (limitReached) {
        return toast.error(t`Please choose either 1 video, 1 audio file, or up to 4 photos.`);
      }
      // Type check
      if (isTypeAllowed(files as FileList)) {
        await handleUploadAttachments(files);
        evt.target.value = '';
      } else {
        return toast.error(t`File format not allowed.`);
      }
    } catch {
      toast.error(t`Something went wrong while uploading!`);
    }
  };

  return (
    <Menu as="div">
      <Menu.Button as={Fragment}>
        <button onClick={() => setShowMenu(!showMenu)} aria-label="More">
          {isUploading ? (
            <Spinner size="sm" />
          ) : (
            <Tooltip placement="top" content="Media">
              <PhotographIcon className="text-brand h-5 w-5" />
            </Tooltip>
          )}
        </button>
      </Menu.Button>
      <MenuTransition show={showMenu}>
        <Menu.Items
          ref={dropdownRef}
          static
          className="absolute z-[5] mt-2 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
        >
          <Menu.Item
            as="label"
            disabled={limitReached}
            className={({ active }) =>
              clsx(
                { 'dropdown-active': active },
                'menu-item !flex cursor-pointer items-center gap-1 space-x-1 rounded-lg'
              )
            }
            htmlFor={`image_${id}`}
          >
            <PhotographIcon className="text-brand h-4 w-4" />
            <span className="text-sm">Upload image(s)</span>
            <input
              id={`image_${id}`}
              type="file"
              multiple
              accept={ALLOWED_IMAGE_TYPES.join(',')}
              className="hidden"
              onChange={handleAttachment}
              disabled={limitReached}
            />
          </Menu.Item>
          <Menu.Item
            as="label"
            disabled={isImageAttachmentType || limitReached}
            className={({ active }) =>
              clsx(
                { 'dropdown-active': active },
                'menu-item !flex cursor-pointer items-center gap-1 space-x-1 rounded-lg'
              )
            }
            htmlFor={`video_${id}`}
          >
            <VideoCameraIcon className="text-brand h-4 w-4" />
            <span className="text-sm">Upload video</span>
            <input
              id={`video_${id}`}
              type="file"
              accept={ALLOWED_VIDEO_TYPES.join(',')}
              className="hidden"
              onChange={handleAttachment}
              disabled={isImageAttachmentType || limitReached}
            />
          </Menu.Item>
          <Menu.Item
            disabled={isImageAttachmentType || limitReached}
            as="label"
            className={({ active }) =>
              clsx(
                { 'dropdown-active': active },
                'menu-item !flex cursor-pointer items-center gap-1 space-x-1 rounded-lg'
              )
            }
            htmlFor={`audio_${id}`}
          >
            <MusicNoteIcon className="text-brand h-4 w-4" />
            <span className="text-sm">Upload audio</span>
            <input
              id={`audio_${id}`}
              type="file"
              accept={ALLOWED_AUDIO_TYPES.join(',')}
              className="hidden"
              onChange={handleAttachment}
              disabled={isImageAttachmentType || limitReached}
            />
          </Menu.Item>
        </Menu.Items>
      </MenuTransition>
    </Menu>
  );
};

export default Attachment;
