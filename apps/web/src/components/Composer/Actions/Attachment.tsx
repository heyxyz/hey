import MenuTransition from "@components/Shared/MenuTransition";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  MusicalNoteIcon,
  PhotoIcon,
  VideoCameraIcon
} from "@heroicons/react/24/outline";
import { Spinner, Tooltip } from "@hey/ui";
import cn from "@hey/ui/cn";
import {
  MediaAudioMimeType,
  MediaImageMimeType
} from "@lens-protocol/metadata";
import { useClickAway } from "@uidotdev/usehooks";
import type { ChangeEvent, FC, JSX, MutableRefObject } from "react";
import { useId, useState } from "react";
import toast from "react-hot-toast";
import useUploadAttachments from "src/hooks/useUploadAttachments";
import { usePostAttachmentStore } from "src/store/non-persisted/post/usePostAttachmentStore";

const ImageMimeType = Object.values(MediaImageMimeType);
const AudioMimeType = Object.values(MediaAudioMimeType);
const VideoMimeType = [
  "video/mp4",
  "video/mpeg",
  "video/ogg",
  "video/webm",
  "video/quicktime"
];
const MAX_IMAGE_UPLOAD = 4;

const Attachment: FC = () => {
  const { attachments, isUploading } = usePostAttachmentStore((state) => state);
  const { handleUploadAttachments } = useUploadAttachments();
  const [showMenu, setShowMenu] = useState(false);
  const id = useId();
  const dropdownRef = useClickAway(() =>
    setShowMenu(false)
  ) as MutableRefObject<HTMLDivElement>;

  const isTypeAllowed = (files: FileList) =>
    Array.from(files).some((file) =>
      [...ImageMimeType, ...AudioMimeType, ...VideoMimeType].includes(file.type)
    );

  const isUploadAllowed = (files: FileList) => {
    const isImage = files[0]?.type.startsWith("image");
    return isImage
      ? attachments.length + files.length <= MAX_IMAGE_UPLOAD
      : files.length === 1;
  };

  const handleAttachment = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault();
    setShowMenu(false);
    const { files } = evt.target;
    if (!files) return;

    if (!isUploadAllowed(files)) {
      return toast.error("Exceeded max limit of 1 audio, 1 video, or 4 images");
    }
    if (!isTypeAllowed(files)) {
      return toast.error("File format not allowed.");
    }
    try {
      await handleUploadAttachments(files);
      evt.target.value = "";
    } catch {
      toast.error("Something went wrong while uploading!");
    }
  };

  const disableImageUpload = attachments.length >= MAX_IMAGE_UPLOAD;
  const disableOtherUpload = attachments.length > 0;

  const renderUploadOption = (
    idSuffix: string,
    label: string,
    icon: JSX.Element,
    accept: string[],
    disabled: boolean
  ) => (
    <MenuItem
      as="label"
      className={({ focus }) =>
        cn(
          "menu-item !flex cursor-pointer items-center gap-1 space-x-1 rounded-lg",
          { "dropdown-active": focus, "opacity-50": disabled }
        )
      }
      disabled={disabled}
      htmlFor={`${id}_${idSuffix}`}
    >
      {icon}
      <span className="text-sm">{label}</span>
      <input
        accept={accept.join(",")}
        className="hidden"
        disabled={disabled}
        id={`${id}_${idSuffix}`}
        multiple={idSuffix === "image"}
        onChange={handleAttachment}
        type="file"
      />
    </MenuItem>
  );

  return (
    <Tooltip content="Media" placement="top">
      <Menu as="div">
        <MenuButton
          aria-label="More"
          className="rounded-full outline-offset-8"
          onClick={() => setShowMenu(!showMenu)}
        >
          {isUploading ? (
            <Spinner size="sm" />
          ) : (
            <PhotoIcon className="size-5" />
          )}
        </MenuButton>
        <MenuTransition show={showMenu}>
          <MenuItems
            className="absolute z-[5] mt-2 rounded-xl border bg-white py-1 shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900"
            ref={dropdownRef}
            static
          >
            {renderUploadOption(
              "image",
              "Upload image(s)",
              <PhotoIcon className="size-4" />,
              ImageMimeType,
              disableImageUpload
            )}
            {renderUploadOption(
              "video",
              "Upload video",
              <VideoCameraIcon className="size-4" />,
              VideoMimeType,
              disableOtherUpload
            )}
            {renderUploadOption(
              "audio",
              "Upload audio",
              <MusicalNoteIcon className="size-4" />,
              AudioMimeType,
              disableOtherUpload
            )}
          </MenuItems>
        </MenuTransition>
      </Menu>
    </Tooltip>
  );
};

export default Attachment;
