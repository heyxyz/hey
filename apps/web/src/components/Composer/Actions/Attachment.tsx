import { Spinner } from '@components/UI/Spinner';
import { Tooltip } from '@components/UI/Tooltip';
import useOnClickOutside from '@components/utils/hooks/useOnClickOutside';
import useUploadAttachments from '@components/utils/hooks/useUploadAttachments';
import { Menu, Transition } from '@headlessui/react';
import { MusicNoteIcon, PhotographIcon, VideoCameraIcon } from '@heroicons/react/outline';
import { Leafwatch } from '@lib/leafwatch';
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
import { PUBLICATION } from 'src/tracking';

const Attachment: FC = () => {
  const attachments = usePublicationStore((state) => state.attachments);
  const isUploading = usePublicationStore((state) => state.isUploading);
  const { handleUploadAttachments } = useUploadAttachments();
  const [showMenu, setShowMenu] = useState(false);
  const id = useId();
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setShowMenu(false));

  const hasVideos = (files: any) => {
    let videos = 0;
    let images = 0;

    for (const file of files) {
      if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
        videos = videos + 1;
      } else {
        images = images + 1;
      }
    }

    if (videos > 0) {
      if (videos > 1) {
        return true;
      }

      return images > 0 ? true : false;
    }

    return false;
  };

  const isTypeAllowed = (files: any) => {
    for (const file of files) {
      if (ALLOWED_MEDIA_TYPES.includes(file.type)) {
        return true;
      }
    }

    return false;
  };

  const isImageType = (files: any) => {
    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return false;
      }
    }

    return true;
  };

  const handleAttachment = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setShowMenu(false);

    try {
      const { files } = evt.target;
      // Count check
      if (files && (hasVideos(files) || (isImageType(files) && files.length + attachments.length > 4))) {
        return toast.error('Please choose either 1 video or up to 4 photos.');
      }

      // Type check
      if (isTypeAllowed(files)) {
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
        onClick={() => setShowMenu(!showMenu)}
        className="rounded-full hover:bg-gray-300 hover:bg-opacity-20"
        aria-label="More"
      >
        {isUploading ? (
          <Spinner size="sm" />
        ) : (
          <Tooltip placement="top" content="Media">
            <PhotographIcon className="w-5 h-5 text-brand" />
          </Tooltip>
        )}
      </Menu.Button>
      <Transition
        show={showMenu}
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          ref={dropdownRef}
          static
          className="absolute py-1 z-[5] mt-2 bg-white rounded-xl border shadow-sm dark:bg-gray-900 focus:outline-none dark:border-gray-700/80"
        >
          <Menu.Item
            as="label"
            className={({ active }) =>
              clsx(
                { 'dropdown-active': active },
                '!flex rounded-lg gap-1 space-x-1 items-center cursor-pointer menu-item'
              )
            }
            htmlFor={`image_${id}`}
          >
            <PhotographIcon className="w-4 h-4 text-brand" />
            <span className="text-sm">Upload image(s)</span>
            <input
              id={`image_${id}`}
              type="file"
              multiple
              accept={ALLOWED_IMAGE_TYPES.join(',')}
              className="hidden"
              onClick={() => Leafwatch.track(PUBLICATION.NEW.ATTACHMENT.UPLOAD_IMAGES)}
              onChange={handleAttachment}
              disabled={attachments.length >= 4}
            />
          </Menu.Item>
          <Menu.Item
            as="label"
            className={({ active }) =>
              clsx(
                { 'dropdown-active': active },
                '!flex rounded-lg gap-1 space-x-1 items-center cursor-pointer menu-item'
              )
            }
            htmlFor={`video_${id}`}
          >
            <VideoCameraIcon className="w-4 h-4 text-brand" />
            <span className="text-sm">Upload video</span>
            <input
              id={`video_${id}`}
              type="file"
              accept={ALLOWED_VIDEO_TYPES.join(',')}
              className="hidden"
              onClick={() => Leafwatch.track(PUBLICATION.NEW.ATTACHMENT.UPLOAD_VIDEO)}
              onChange={handleAttachment}
              disabled={attachments.length >= 4}
            />
          </Menu.Item>
          <Menu.Item
            as="label"
            className={({ active }) =>
              clsx(
                { 'dropdown-active': active },
                '!flex rounded-lg gap-1 space-x-1 items-center cursor-pointer menu-item'
              )
            }
            htmlFor={`audio_${id}`}
          >
            <MusicNoteIcon className="w-4 h-4 text-brand" />
            <span className="text-sm">Upload audio</span>
            <input
              id={`audio_${id}`}
              type="file"
              accept={ALLOWED_AUDIO_TYPES.join(',')}
              className="hidden"
              onClick={() => Leafwatch.track(PUBLICATION.NEW.ATTACHMENT.UPLOAD_AUDIO)}
              onChange={handleAttachment}
              disabled={attachments.length >= 4}
            />
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Attachment;
