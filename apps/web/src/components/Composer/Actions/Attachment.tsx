import MenuTransition from '@components/Shared/MenuTransition';
import { Menu } from '@headlessui/react';
import {
  MusicalNoteIcon,
  PhotoIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import {
  ALLOWED_AUDIO_TYPES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_MEDIA_TYPES,
  ALLOWED_VIDEO_TYPES
} from '@hey/data/constants';
import { Spinner, Tooltip } from '@hey/ui';
import cn from '@hey/ui/cn';
import { t } from '@lingui/macro';
import type { ChangeEvent, FC } from 'react';
import { Fragment, useId, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import useUploadAttachments from 'src/hooks/useUploadAttachments';
import { usePublicationStore } from 'src/store/publication';
import { useOnClickOutside } from 'usehooks-ts';
const Attachment: FC = () => {
  const attachments = usePublicationStore((state) => state.attachments);
  const isUploading = usePublicationStore((state) => state.isUploading);
  const { handleUploadAttachments } = useUploadAttachments();
  const [showMenu, setShowMenu] = useState(false);
  const id = useId();
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setShowMenu(false));

  const isTypeAllowed = (files: FileList) => {
    for (const file of files) {
      if (ALLOWED_MEDIA_TYPES.includes(file.type)) {
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
    const notImage =
      attachments[0] &&
      attachments[0].original.mimeType.slice(0, 5) !== 'image';
    const isLimit = !notImage && attachments.length >= 4;
    return notImage || isLimit;
  };

  const handleAttachment = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setShowMenu(false);

    try {
      const { files } = evt.target;
      if (!isUploadAllowed(files as FileList)) {
        toast.error(t`Exceeded max limit of 1 audio, or 1 video, or 4 images`);
        return;
      }
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
            <Tooltip placement="top" content={t`Media`}>
              <PhotoIcon className="text-brand h-5 w-5" />
            </Tooltip>
          )}
        </button>
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
            <PhotoIcon className="text-brand h-4 w-4" />
            <span className="text-sm">Upload image(s)</span>
            <input
              id={`image_${id}`}
              type="file"
              multiple
              accept={ALLOWED_IMAGE_TYPES.join(',')}
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
            <VideoCameraIcon className="text-brand h-4 w-4" />
            <span className="text-sm">Upload video</span>
            <input
              id={`video_${id}`}
              type="file"
              accept={ALLOWED_VIDEO_TYPES.join(',')}
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
            <MusicalNoteIcon className="text-brand h-4 w-4" />
            <span className="text-sm">Upload audio</span>
            <input
              id={`audio_${id}`}
              type="file"
              accept={ALLOWED_AUDIO_TYPES.join(',')}
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
